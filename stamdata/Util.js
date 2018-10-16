var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var sns = new AWS.SNS();
var util = require('./Util');

// functie voor het registreren van een foutmelding in DynamoDb (tabel Foutmelding)
exports.logFoutmelding = function(isbn, message, callback) {
  // foutmelding loggen
  var item = {
    Isbn: {N: isbn},
    Timestamp: {S: new Date().toISOString()},
    Melding: {S: message}
  };

  // de parameters voor DynamoDb
  var params = {
    TableName: 'Foutmelding',
    Item: item
  };

  util.persisteer(params, callback);
};

// functie voor het opslaan in de Dynamo database
exports.persisteer = function(params, callback) {
  var callbackDdb = function(err, data) {
    if (err) {
      console.error('data is niet opgeslagen in tabel ' + params.TableName);
      console.error(err);
      util.logSysteemfout("Fout bij schrijven in DynamoDB: " + err.message, function(result) {
        callback(new Error("Fout bij schrijven in DynamoDB: " + err.message)); // fout
      });
    } else {
      console.log('data is opgeslagen in tabel ' + params.TableName);
      callback(null);
    }
  };

  dynamodb.putItem(params, callbackDdb);
};

// functie voor het registreren van een systeemfout in een SNS
exports.logSysteemfout = function(message, callback) {
  // de parameters voor SNS
  var params = {
    Message: message,
    TopicArn: process.env.SNS_ARN // de Arn van de SNS komt uit de omgevingsvariabele SNS_ARN
  };

  var publishFoutPromise = sns.publish(params).promise();

  publishFoutPromise.then(
    function(data) {
      console.log('Message ' + params.Message + '  is verzonden naar topic ' + params.TopicArn);
      console.log("MessageID is " + data.MessageId);
      callback(null); // true
    }).catch(
      function(err) {
        console.error("logSysteemfout", err.stack);
        callback(new Error("Fout bij het sturen naar SNS")); // false
      }
    );
};

// functie om een object uit een JSON structuur te halen
exports.getNested = function(theObject, path, separator) {
    try {
        separator = separator || '.';

        return path.
                replace('[', separator).replace(']','').
                split(separator).
                reduce(
                    function (obj, property) {
                        return obj[property];
                    }, theObject
                );

    } catch (err) {
        return undefined;
    }
};

// functie om te controleren of een object leeg is
exports.isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};
