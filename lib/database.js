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
    callback(null, result.rows[0]);
  });
};

exports.insertUserFromGoogle = function (client, credentials, callback) {
  client.query("INSERT INTO clients (data) VALUES ($1) RETURNING id", [{
    google: credentials
  }], function (err, result) {
    if (err) {
      callback(err, null);
    }
    console.log(result);
    callback(null, result.rows[0].id);
  });
};
