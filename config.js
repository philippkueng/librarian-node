'use strict';

var env = function (preferredValue, defaultValue) {
  return preferredValue !== null ? preferredValue : defaultValue;
};

exports.system = {
  host: '0.0.0.0',
  port: env(process.env.PORT, 3000)
};

exports.postgres = env(process.env.DATABASE_URL, "postgres://localhost/librarian");

exports.cookiePassword = env(process.env.COOKIE_PASSWORD, 'librarian-password');

exports.google = {
  provider: "google",
  password: env(process.env.GOOGLE_COOKIE_PASSWORD, "cookie-encryption-password"),
  clientId: env(process.env.GOOGLE_CLIENT_ID, ""),
  clientSecret: env(process.env.GOOGLE_CLIENT_SECRET, ""),
  isSecure: false,
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.readonly'],
  providerParams: {
    access_type: "offline",
    response_type: "code",
    approval_prompt: "force"
  }
};
