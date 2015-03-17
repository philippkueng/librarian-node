"use strict";

var google = require("googleapis");
var OAuth2 = google.auth.OAuth2;
var drive = google.drive("v2");

var config = require("./../config");

exports.getOauth2Client = function (token) {
  var oauth2Client = new OAuth2(config.google.clientId, config.google.clientSecret, "");
  return oauth2Client.setCredentials({access_token: token});
};

exports.search = function (term, oauth2Client, callback) {
  drive.files.list({
    fullText: term,
    auth: oauth2Client
  }, function (err, response) {
    if (err) {
      throw err;
    }
    callback(null, response);
  });
};
