"use strict";

var queryJson = function (obj) {
  return "'" + JSON.stringify(obj) + "'";
};

exports.getUserByGoogleEmail = function (client, email, callback) {
  var queryObject = {
    google: {
      profile: {
        email: email
      }
    }
  };

  var query = "SELECT * FROM clients WHERE data @> " + queryJson(queryObject);

  client.query(query, function (err, result) {
    if (err) {
      throw err;
    }
    callback(null, result);
  });
};
