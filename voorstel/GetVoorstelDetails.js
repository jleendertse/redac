var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var util = require('./Util');

var response = {};

// haal de titelpagina op en roep daarna getColofon aan
function getTitelpagina(isbn, callbackEnd, context) {
  var tabelnaam = 'Titelpagina';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn}}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getTitelpagina: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        // if (!util.isEmpty(util.getNested(data, 'Item.Titelpagina'))) { resp['Titelpagina'] = util.getNested(data, 'Item.Titelpagina.S')}
        response[tabelnaam] = resp;
      }
      getColofon(isbn, callbackEnd, context);
    }
  };

  dynamodb.getItem(params, callback);
}

// haal de colofon op en roep daarna getResultaatStringTitelpagina aan
function getColofon(isbn, callbackEnd, context) {
  var tabelnaam = 'Colofon';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn}}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getColofon: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        // if (!util.isEmpty(util.getNested(data, 'Item.Colofon'))) { resp['Colofon'] = util.getNested(data, 'Item.Colofon.S')}
        response[tabelnaam] = resp;
      }
      getResultaatStringTitelpagina(isbn, callbackEnd, context);
    }
  };

  dynamodb.getItem(params, callback);
}

// haal de resultaatstring van de titelpagina op en roep daarna getResultaatStringColofon aan
function getResultaatStringTitelpagina(isbn, callbackEnd, context) {
  var tabelnaam = 'RekognitionResultaat';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn},
      "Bronkode": {N: "1"}
    }
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getResultaatStringTitelpagina: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        // resp['Bronkode'] = '1';
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        // if (!util.isEmpty(util.getNested(data, 'Item.Resultaatstring'))) { resp['Resultaatstring'] = util.getNested(data, 'Item.Resultaatstring.S')}
        response[tabelnaam + '-Titelpagina'] = resp;
      }
      getResultaatStringColofon(isbn, callbackEnd, context);
    }
  };

  dynamodb.getItem(params, callback);
}

// haal de resultaatstring van de colofon op en roep daarna getVoorstel aan
function getResultaatStringColofon(isbn, callbackEnd, context) {
  var tabelnaam = 'RekognitionResultaat';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn},
      "Bronkode": {N: "2"}
    }
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getResultaatStringColofon: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        // resp['Bronkode'] = '2';
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        // if (!util.isEmpty(util.getNested(data, 'Item.Resultaatstring'))) { resp['Resultaatstring'] = util.getNested(data, 'ItemResultaatstring.S')}
        response[tabelnaam + '-Colofon'] = resp;
      }
      getVoorstel(isbn, callbackEnd, context);
    }
  };

  dynamodb.getItem(params, callback);
}

// haal het voorstel op en roep daarna getFoutmelding aan
function getVoorstel(isbn, callbackEnd, context) {
  var tabelnaam = 'Voorstel';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn}}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getVoorstel: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        if (!util.isEmpty(util.getNested(data, 'Item.Voorstel'))) { resp['Voorstel'] = util.getNested(data, 'Item.Voorstel.S')}
        response[tabelnaam] = resp;
      }
      getFoutmelding(isbn, callbackEnd, context);
    }
  };

  dynamodb.getItem(params, callback);
}

// haal de eventuele foutmeldingen op en roep de callback aan
function getFoutmelding(isbn, callbackEnd, context) {
  var tabelnaam = 'Foutmelding';

  var params = {
    TableName: tabelnaam,
    Key: {"Isbn": {N: isbn}}
  };

  var callback = function(err, data) {
    if (err) {
      console.log('error on getFoutmelding: ', err);
      context.done('Unable to retrieve ' + tabelnaam + ' information', null);
    } else {
      console.log(tabelnaam + ' data: ', JSON.stringify(data));
      if (data.Item && util.isEmpty(util.getNested(data, 'Item'))) {
        console.log(tabelnaam + ': geen data gevonden');
      } else {
        console.log(tabelnaam + ': data gevonden!');
        var resp = {};
        if (!util.isEmpty(util.getNested(data, 'Item.Timestamp'))) { resp['Timestamp'] = util.getNested(data, 'Item.Timestamp.S')}
        if (!util.isEmpty(util.getNested(data, 'Item.Melding'))) { resp['Melding'] = util.getNested(data, 'Item.Melding.S')}
        response[tabelnaam] = resp;
      }
      callbackEnd();
    }
  };

  dynamodb.getItem(params, callback);
}

// haal alle informatie op over een isbn
exports.handler = function(event, context) {
  getTitelpagina(event.Isbn, function() {
    console.log('alle data gevonden!');
    response['Isbn'] = event.Isbn;
    context.done(null, JSON.stringify(response));
  }, context);
};
