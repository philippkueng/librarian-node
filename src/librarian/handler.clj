(ns librarian.handler
  (:require [librarian.routes :as routes]
            [librarian.config :as config]
            [compojure.core :as compojure]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.util.response :as resp]
            [cemerick.friend :as friend]
            (cemerick.friend [workflows :as workflows]
                             [credentials :as creds])
            [friend-oauth2.workflow :as oauth2]
            [friend-oauth2.util :refer [format-config-uri]]
            [cheshire.core :as cheshire]
            [ring.adapter.jetty :as ring])
  (:use [ring.adapter.jetty :as ring]
        [ring.middleware.json :only [wrap-json-response]]
        [ring.middleware.params :only [wrap-params]]
        [ring.util.codec :only [url-encode]]))

(defn credential-fn
  [token]
  ;;lookup token in DB or whatever to fetch appropriate :roles
  {:identity token :roles #{::user}})

(def uri-config
  {:authentication-uri {:url "https://accounts.google.com/o/oauth2/auth"
                       :query {:client_id (:client-id config/google)
                               :response_type "code"
                               :redirect_uri (format-config-uri config/google)
                               :scope "email"}}

   :access-token-uri {:url "https://accounts.google.com/o/oauth2/token"
                      :query {:client_id (:client-id config/google)
                              :client_secret (:client-secret config/google)
                              :grant_type "authorization_code"
                              :redirect_uri (format-config-uri config/google)}}})

(comment (compojure/defroutes app-routes
           (compojure/GET routes/home-template request "<h1>hello world!</h1>")))

(compojure/defroutes app-routes
  (compojure/GET "/" request "open.")
  (compojure/GET "/status" request
       (let [count (:count (:session request) 0)
             session (assoc (:session request) :count (inc count))]
         (-> (ring.util.response/response
              (str "<p>We've hit the session page " (:count session)
                   " times.</p><p>The current session: " session "</p>"))
             (assoc :session session))))
  (compojure/GET "/authlink" request
       (friend/authorize #{::user} "Authorized page."))
  (compojure/GET "/authlink2" request
       (friend/authorize #{::user} "Authorized page 2."))
  (compojure/GET "/admin" request
       (friend/authorize #{::admin} "Only admins can see this page."))
  (friend/logout (compojure/ANY "/logout" request (ring.util.response/redirect "/"))))

(def app
  (handler/site
   (friend/authenticate
    (-> app-routes
        wrap-json-response
        wrap-params)
    {:allow-anon? true
     :workflows [(oauth2/workflow
                  {:client-config config/google
                   :uri-config    uri-config
                   :credential-fn credential-fn})]})
   
   ;; ...more required middleware...
   ))

(defn -main [port]
  (run-jetty app {:port (read-string port) :join? false}))

