var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var util = require('./Util');

exports.handler = function(event, context) {
  var betrokkene = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);
  
  var params = {
    TableName: betrokkene,
    Key: {"Id": {N: event.Id}}
  };
  
  var callback = function(err, data) {
    if (err) {
      console.log('error on deleteBetrokkene: ', err);
      util.logFoutmelding(isbn, err.message, function(result) {
        context.done('Unable to delete ' + betrokkene + ' information', null);
      });
    } else {
        context.done(null, {});
    }
  };

  dynamodb.deleteItem(params, callback);
};
