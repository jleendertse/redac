var AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();
var atob = require('atob');
var util = require('./Util');

exports.handler = function(event, context, callback) {

  console.log('Stream records: ', JSON.stringify(event.Records, null, 2));

  event.Records.forEach(function(record) {

    var key = record.s3.object.key;
    var dir = key.split("/")[0];
    var isbn = key.split("/")[1];
    console.log('Dir: ' + dir + ',Isbn: ' + isbn + ' : Start');
    var bronkode = null;
    var brondocument = null;
    if (dir == 'titelpagina') {
      console.log('Isbn: ' + isbn + ' : Titelpagina gevonden');
      bronkode = "1";
      brondocument = "Titelpagina";
    }
    if (dir == 'colofon') {
      console.log('Isbn: ' + isbn + ' : Colofon gevonden');
      bronkode = "2" ;
      brondocument = "Colofon";
    }
    if (bronkode === null) {
      // er is een onbekend brondocument aangeboden
        util.logSysteemfout("Isbn: " + isbn + ": Onbekend document", function(result) {
          console.error('Isbn' + isbn + ' : Onbekend document');
        });
    } else {
      var s3 = new AWS.S3();
      var S3params = {
        Bucket: process.env.S3BucketName,
        Key: key
      };
      s3.getObject(S3params, function(err, data) {
        // Handle any error and exit
        if (err) {
          util.logFoutmelding(isbn, brondocument + ": " + err.message, function(err, data) {
            console.error('Isbn: ' + isbn + ' error: ' + err);
          });
        } else {
          // S3 ophalen is goed gegaan
          console.log('Isbn: ' + isbn + ' S3 data: ' + JSON.stringify(data));

          // decodeer image van base64 naar originele formaat
          var binaryImg = atob(JSON.stringify(data.Body.toString('utf-8')).replace(/\"/g, ""));
          var length = binaryImg.length;
          var ab = new ArrayBuffer(length);
          var ua = new Uint8Array(ab);
          for (var i = 0; i < length; i++) {
              ua[i] = binaryImg.charCodeAt(i);
          }

          // de parameters voor de Rekognition
          var params = {
            Image: {
              Bytes: ab
            }
          };

          // callback voor de Rekognition service
          var callbackRekognition = function(err, data) {
            if (err) {
              util.logFoutmelding(isbn, brondocument + ": " + err.message, function(err, data) {
                console.error('Isbn: ' + isbn + ' error: ' + err);
              });
            } else {
              // Rekognition is goed gegaan
              console.log('Isbn: ' + isbn + 'ontvangen data: ' + JSON.stringify(data));

              // bepaal de systeemdatum + 3 dagen --> dat is de datum waarop de gegevens moeten worden geschoond
              var dateEpoch = Math.floor(new Date().getTime()/1000) + 3*24*60*60;
              var item = {
                Isbn: {N: isbn},
                Bronkode: {N: bronkode},
                DeleteDateTTL: {N: String(dateEpoch)},
                Timestamp: {S: new Date().toISOString()},
                Resultaatstring: {S: JSON.stringify(data)}
              };

              // de parameters voor DynamoDb
              var tableName = 'RekognitionResultaat';
              var params = {
                TableName: tableName,
                Item: item
              };

              util.persisteer(params, function(err, data) {
                if (err) {
                  console.error('Isbn: ' + isbn + ', Brondocument ' + brondocument + ': fout bij opslaan rekognition tekst');
                } else {
                  console.log('Isbn: ' + isbn + ', Brondocument ' + brondocument + ' tekstherkenning gedaan');
                }
              });
            }
          };

          console.log('Isbn: ' + isbn +  ', Start aanroep Rekognition');
          rekognition.detectText(params, callbackRekognition);
        }
      });
    }
  });
  callback(null, "Successfully processed " + event.Records.length + " records.");
};
