var util = require('./Util');

exports.handler = function(event, context) {

  console.log('lengte van data: ' + event.Colofon.length);

  var s3Params = {
    Bucket: process.env.S3BucketName,
    Key:    "colofon/" + event.Isbn,
    Body:   event.Colofon
  };

  util.putObjectToS3(s3Params, function(err, data) {
    if (err) {
      context.done('Colofon: ' + event.Isbn + ', UpdateColofon: Fout bij opslaan in S3', null);
    } else {
      console.log('Colofon: ' + event.Isbn + ', UpdateColofon: opgeslagen in S3');
      context.done(null, 'Colofon ' + event.Isbn + ' is opgeslagen');
    }
  });

};
