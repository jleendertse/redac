var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var util = require('./Util');

exports.handler = function(event, context) {
  var betrokkene = event.Tabel.charAt(0).toUpperCase() + event.Tabel.substr(1);

  var item = {
    Id: {N: event.Id}
  }

  if (!util.isEmpty(event.Voornaam)) { item['Voornaam'] = {S: event.Voornaam}}
  if (!util.isEmpty(event.Voorletters)) { item['Voorletters'] = {S: event.Voorletters}}
  if (!util.isEmpty(event.Voorvoegsels)) { item['Voorvoegsels'] = {S: event.Voorvoegsels}}
  if (!util.isEmpty(event.Achternaam)) { item['Achternaam'] = {S: event.Achternaam}}
  if (!util.isEmpty(event.UitgVoornaam)) { item['UitgVoornaam'] = {S: event.UitgVoornaam}}

  var params = {
    TableName: betrokkene,
    Item: item
  }

  util.persisteer(params, function(result) {
    if (result) {
      context.done(null, 'Id: ' + event.Id + ', UpdateBetrokkene: betrokkene opgeslagen');
    } else {
      context.done('Id: ' + event.Id + ', UpdateBetrokkene: fout bij opslaan betrokkene', null);
    }
  });
};
