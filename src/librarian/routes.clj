(ns librarian.routes
  (:require [compojure.core :as compojure]
            [compojure.route :as route])
  (:use [clojurewerkz.route-one.core]))

(defroute home "/")
