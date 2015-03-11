'use strict';

var env = function (preferredValue, defaultValue) {
  return preferredValue !== null ? preferredValue : defaultValue;
};

exports.system = {
  host: 'localhost',
  port: process.env.PORT ? process.env.PORT : 3000
}

exports.google = {
  provider: 'google',
  password: 'cookie-encryption-password',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  isSecure: false,
  scope: [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly'],
  providerParams: {
    access_type: 'offline',
    response_type: 'code'
  }
}
