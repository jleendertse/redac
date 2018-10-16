var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var util = require('./Util');

exports.handler = function(event, context) {
  var specificatie = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);

  var params = {
    TableName: specificatie,
    Key: {"Id": {N: event.Id}}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on deleteSpecificatie: ', err);
      util.logFoutmelding(event.Id, err.message, function(result) {
        context.done('Unable to delete ' + specificatie + ' information', null);
      });
    } else {
        context.done(null, {});
    }
  };

  dynamodb.deleteItem(params, callback);
};
