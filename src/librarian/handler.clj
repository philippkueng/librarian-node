(ns librarian.handler
  (:require [compojure.core :as compojure]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.util.response :as resp]
            [ring.adapter.jetty :as ring]
            [librarian.routes :as routes])
  (:use [ring.adapter.jetty :as ring]
        [ring.middleware.json :only [wrap-json-response]]
        [ring.middleware.params :only [wrap-params]]
        [ring.util.codec :only [url-encode]]))

(compojure/defroutes app-routes
  (compojure/GET routes/home-template request "<h1>hello world!</h1>"))

(def app
  (handler/site (-> app-routes
                    wrap-json-response
                    wrap-params)))

(defn -main [port]
  (run-jetty app {:port (read-string port) :join? false}))

