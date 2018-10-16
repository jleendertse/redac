var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var util = require('./Util');

exports.handler = function(event, context) {
  var betrokkene = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);

  var params = {
    TableName: betrokkene,
    Key: {"Id": Number(event.Id)}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getBetrokkene: ', err);
      util.logFoutmelding(event.Id, err.message, function(result) {
        context.done('Unable to retrieve ' + betrokkene + ' information', null);
      });
    } else {
      console.log('data: ', JSON.stringify(data));
      var response = {};
      if (data.Item == null) {
        console.log('geen data gevonden');
      } else {
        console.log('data gevonden!');
        response['Id'] = event.Id;
        if (!util.isEmpty(util.getNested(data, 'Item.Voornaam'))) { response['Voornaam'] = util.getNested(data, 'Item.Voornaam')}
        if (!util.isEmpty(util.getNested(data, 'Item.Voorletters'))) { response['Voorletters'] = util.getNested(data, 'Item.Voorletters')}
        if (!util.isEmpty(util.getNested(data, 'Item.Voorvoegsels'))) { response['Voorvoegsels'] = util.getNested(data, 'Item.Voorvoegsels')}
        if (!util.isEmpty(util.getNested(data, 'Item.Achternaam'))) { response['Achternaam'] = util.getNested(data, 'Item.Achternaam')}
        if (!util.isEmpty(util.getNested(data, 'Item.UitgVoornaam'))) { response['UitgVoornaam'] = util.getNested(data, 'Item.UitgVoornaam')}
      }
      context.done(null, response);
    }
  };

  docClient.get(params, callback);
};
