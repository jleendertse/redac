var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var util = require('./Util');

exports.handler = function(event, context) {
  var tabelnaam = 'Voorstel';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": Number(event.Isbn)}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getVoorstel: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log('data: ', JSON.stringify(data));
      var response = {};
      if (data.Item == null) {
        console.log('geen data gevonden');
      } else {
        console.log('data gevonden!');
        response['Isbn'] = event.Isbn;
        if (!util.isEmpty(util.getNested(data, 'Item.Voorstel'))) { response['Voorstel'] = util.getNested(data, 'Item.Voorstel')}
      }
      context.done(null, response);
    }
  };

  docClient.get(params, callback);
};
