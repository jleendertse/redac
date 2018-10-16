var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var util = require('./Util');

exports.handler = function(event, context) {
  var specificatie = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);

  var params = {
    TableName: specificatie,
    Key: {"Id": Number(event.Id)}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getSpecificatie: ', err);
      util.logFoutmelding(event.Id, err.message, function(result) {
        context.done('Unable to retrieve ' + specificatie + ' information', null);
      });
    } else {
      console.log('data: ', JSON.stringify(data));
      var response = {};
      if (data.Item == null) {
        console.log('geen data gevonden');
      } else {
        console.log('data gevonden!');
        response['Id'] = event.Id;
        if (!util.isEmpty(util.getNested(data, 'Item.Omschrijving'))) { response['Omschrijving'] = util.getNested(data, 'Item.Omschrijving')}
      }
      context.done(null, response);
    }
  };

  docClient.get(params, callback);
};
