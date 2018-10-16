var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var util = require('./Util');

exports.handler = function(event, context) {
  var specificatie = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);

  var item = {
    Id: {N: event.Id}
  }

  if (!util.isEmpty(event.Omschrijving)) { item['Omschrijving'] = {S: event.Omschrijving}}

  var params = {
    TableName: specificatie,
    Item: item
  }

  var callback = function(err, data) {
    if (err) {
      console.log(err);
      util.logFoutmelding(event.Id, err.message, function(result) {
        context.done('Unable to update ' + specificatie + ' information', null);
      });
    } else {
      console.log(data);
      context.done(null, data);
    }
  };

  dynamodb.putItem(params, callback);
};
