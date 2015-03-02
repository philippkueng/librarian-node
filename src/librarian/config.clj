(ns librarian.config
  (:require [environ.core :as environ-env]))

(defn env
  "Override the environment extract with default value"
  [env-variable default]
  (let [ev (environ-env/env env-variable)]
    (if (nil? ev)
      default
      ev)))
