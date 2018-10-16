var util = require('./Util');

exports.handler = function(event, context) {

  console.log('lengte van data: ' + event.Titelpagina.length);

  var s3Params = {
    Bucket: process.env.S3BucketName,
    Key:    "titelpagina/" + event.Isbn,
    Body:   event.Titelpagina
  };

  util.putObjectToS3(s3Params, function(err, data) {
    if (err) {
      context.done('Titelpagina: ' + event.Isbn + ', UpdateTitelpagina: Fout bij opslaan in S3', null);
    } else {
      console.log('Titelpagina: ' + event.Isbn + ', UpdateTitelpagina: opgeslagen in S3');
      context.done(null, 'Titelpagina ' + event.Isbn + ' is opgeslagen');
    }
  });

};
