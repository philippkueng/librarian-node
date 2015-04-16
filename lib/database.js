"use strict";

var Promise = require('bluebird');

/**
 * Util functions
 */

var queryJson = function (obj) {
  return "'" + JSON.stringify(obj) + "'";
};

/**
 * Public database functions
 */

exports.getUserByGoogleEmail = function (data) {
  console.log(data.request.auth.credentials);
  return new Promise(function (resolve, reject) {
    var queryObject = {
      google: {
        profile: {
          email: data.request.auth.credentials.profile.email
        }
      }
    };

    var query = "SELECT * FROM clients WHERE data @> " + queryJson(queryObject);

    data.request.pg.client.query(query, function (err, result) {
      if (err) {
        request.log("debug", err);
        reject("Database error");
      }
      if (result.rows.length > 0) {
        data.user = result.rows[0];
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
};

exports.insertUserFromGoogle = function (data) {
  return new Promise(function (resolve, reject) {
    data.request.pg.client.query(
      "INSERT INTO clients (data) VALUES ($1) RETURNING *",
      [{google: data.request.auth.credentials}],
      function (err, result) {
        if (err) {
          data.request.log("error", err);
        }
        if (result.rows.length > 0) {
          data.user = result.rows[0];
          resolve(data);
        } else {
          reject("User not inserted");
        }
      });
  });
};
