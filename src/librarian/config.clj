(ns librarian.config
  (:require [environ.core :as environ-env]))

(defn env
  "Override the environment extract with default value"
  [env-variable default]
  (let [ev (environ-env/env env-variable)]
    (if (nil? ev)
      default
      ev)))
(def google
  {:client-id (env :google-client-id "")
   :client-secret (env :google-secret-id "")
   :callback  {:domain (env :google-callback-domain "http://localhost:3000")
               :path   (env :google-callback-path   "/oauth2callback")}})
