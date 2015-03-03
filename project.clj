(defproject librarian "0.1.0-SNAPSHOT"
  :description "A prototype for a unified search application across cloud services."
  :url "https://github.com/philippkueng/librarian"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.8" :exclusions [ring/ring-core org.clojure/core.incubator]]
                 [ring/ring-jetty-adapter "1.2.2"]
                 [ring/ring-core "1.3.1"]
                 [ring/ring-json "0.3.1"]
                 [environ "0.5.0"]
                 [clojurewerkz/route-one "1.1.0"]
                 [com.cemerick/friend "0.2.1" :exclusions [ring/ring-core]]
                 [friend-oauth2 "0.1.3" :exclusions [org.apache.httpcomponents/httpcore]]
                 [cheshire "5.4.0"]
                 [org.apache.httpcomponents/httpclient "4.3.5"]]
  :plugins [[lein-ring "0.8.11"]]
  :ring {:handler librarian.handler/app}
  :main librarian.handler
  :min-lein-version "2.5.0"
  :uberjar-name "librarian-standalone.jar")
