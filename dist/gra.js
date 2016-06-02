/**
 * Fichier src/ajax/ajax.js
 *
 * @author D'oria Antony
 * @package GRA.ajax
 * @version 1.0
 */
(function (GRA) {

    GRA.ajax = GRA.ajax || {};

    /**
     * @type {object}
     */
    GRA.ajax.const = {
        method: {
            DELETE: 'delete',
            GET: 'get',
            HEAD: 'head',
            POST: 'post',
            PUT: 'put'
        },
        type: {
            HTML: 'html',
            JSON: 'json',
            JSONP: 'jsonp',
            TEXT: 'text',
            XML: 'xml'
        },
        response: {
            SUCCESS: 200,
            UNAUTHORIZED: 403,
            PAGE_NOT_FOUND: 404,
            SERVER_ERROR: 500
        }
    };

    /**
     * Classe Ajax
     * Permet d'effectuer des requêtes asynchrones sur un serveur
     *
     * @constructor
     */
    GRA.ajax.Ajax = function Ajax() {
        /**
         * @type {int}
         */
        var lastResultCode,
            /**
             * @type {function}
             */
            onSuccessCallback,
            /**
             * @type {object}
             */
            onError = {
                xxx: function xxx() {
                    throw new Error("Une erreur AJAX est survenue.");
                },
                403: null,
                404: null,
                500: null
            },
            /**
             * @type {object}
             */
            parameters = {},
            /**
             * @type {string}
             */
            responseType,
            /**
             * @type {boolean}
             */
            sendOnlyOneParameter,
            /**
             * @type {boolean}
             */
            crossDomain,
            /**
             * @type {string}
             */
            url,
            /**
             * Permet de gérer les erreurs
             *
             * @param {integer} errorCode Code de retour d'une requête
             */
            parseError = function parseError(errorCode) {
                var code = parseInt(errorCode, 10);

                if (code === GRA.ajax.const.response.PAGE_NOT_FOUND) {
                    if (null === onError['404']) {
                        onError.xxx();
                    } else {
                        onError['404']();
                    }
                } else if (code === GRA.ajax.const.response.UNAUTHORIZED) {
                    if (null === onError['403']) {
                        onError.xxx();
                    } else {
                        onError['403']();
                    }
                } else if (code === GRA.ajax.const.response.SERVER_ERROR) {
                    if (null === onError['500']) {
                        onError.xxx();
                    } else {
                        onError['500']();
                    }
                } else {
                    onError.xxx();
                }
            },
            /**
             * Permet de gérer les réponses des requêtes
             *
             * @param {string} response Réponse reçue
             * @returns {*} Réponse formattée
             */
            parseResponse = function parseResponse(response) {
                var responseParsed = response;

                if (this.responseType === GRA.ajax.const.type.JSON) {
                    responseParsed = GRA.utils.ObjectUtils.parseJSON(responseParsed);
                } else if (this.responseType === GRA.ajax.const.type.XML) {
                    responseParsed = GRA.utils.ObjectUtils.parseXML(responseParsed);
                }

                return responseParsed;
            },
            /**
             * Permet d'effectuer une requête GET
             *
             * @param {Ajax} self La requête
             * @param {string} source URL cible
             * @param {function} onSuccess Fonction à appeler en cas de succès de la requête
             */
            doGetRequest = function doGetRequest(self, source, onSuccess) {
                var request = new XMLHttpRequest(),
                    queryString = self.queryString();

                self.prepare(source, onSuccess);

                if (crossDomain) {
                    if (request.hasOwnProperty("withCredentials")) {
                        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        request.open(GRA.ajax.const.method.GET, url + "?" + queryString, true);
                    } else if (window.XDomainRequest) {
                        request = new window.XDomainRequest();
                        request.open(GRA.ajax.const.method.GET, url + "?" + queryString);
                    }
                } else {
                    request.open(GRA.ajax.const.method.GET, url + "?" + queryString, true);
                }

                request.onreadystatechange = function onReadyStateChange() {
                    var response;

                    if (4 === this.readyState) {
                        lastResultCode = this.status;

                        if (GRA.ajax.const.response.SUCCESS <= this.status && 400 > this.status) {
                            response = parseResponse(this.responseText);
                            onSuccessCallback(response);
                        } else {
                            parseError(this.status);
                        }
                    }
                };

                request.send();
            },
            /**
             * Permet d'effectuer une requête autre que GET
             *
             * @param {Ajax} self La requête
             * @param {string} method Méthode de la requête
             * @param {string} source URL cible
             * @param {function} onSuccess Fonction à appeler en cas de succès de la requête
             */
            doRequest = function doRequest(self, method, source, onSuccess) {
                var request = new XMLHttpRequest(),
                    queryString = self.queryString();

                self.prepare(source, onSuccess);

                if (crossDomain) {
                    if (request.hasOwnProperty("withCredentials")) {
                        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        request.open(method, url, true);
                    } else if (window.XDomainRequest) {
                        request = new window.XDomainRequest();
                        request.open(method, url);
                    }
                } else {
                    request.open(method, url, true);
                }

                if (method === GRA.ajax.const.method.POST) {
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                }

                request.onreadystatechange = function onReadyStateChange() {
                    var response;

                    if (4 === this.readyState) {
                        lastResultCode = this.status;

                        if (GRA.ajax.const.response.SUCCESS <= this.status && 400 > this.status) {
                            response = parseResponse(this.responseText);
                            onSuccessCallback(response);
                        } else {
                            parseError(this.status);
                        }
                    }
                };

                request.send(queryString);
            };

        /**
         * Permet d'ajouter un paramètre à la requête
         *
         * @param paramName Nom du paramètre
         * @param paramValue Valeur du paramètre
         */
        this.add = function add(paramName, paramValue) {
            parameters[paramName] = paramValue;
        };

        /**
         * Envoi une requête de type DELETE
         *
         * @param {string} [source] URL à requêter
         * @param {function} [onSuccess] Fonction à exécuter en cas de succès
         */
        this.delete = function del(source, onSuccess) {
            doRequest(this, GRA.ajax.const.method.DELETE, source, onSuccess);
        };

        /**
         * Envoi une requête de type GET
         *
         * @param {string} [source] URL à requêter
         * @param {function} [onSuccess] Fonction à exécuter en cas de succès
         */
        this.get = function get(source, onSuccess) {
            doGetRequest(this, source, onSuccess);
        };

        /**
         * Permet de retourner le type de réponse attendu par la requête
         *
         * @returns {string} Type de réponse attendu
         */
        this.getResponseType = function getResponseType() {
            return responseType;
        };

        /**
         * Envoi une requête de type HEAD
         *
         * @param {string} [source] URL à requêter
         * @param {function} [onSuccess] Fonction à exécuter en cas de succès
         */
        this.head = function head(source, onSuccess) {
            doRequest(this, GRA.ajax.const.method.HEAD, source, onSuccess);
        };

        /**
         * Permet de retourner le dernier code de retour de la requête
         *
         * @returns {number} Code de retour de la dernière requête exécutée
         */
        this.lastResultCode = function lastResultCode() {
            return lastResultCode;
        };

        /**
         * Permet de définir la fonction à exécuter en cas de succès de la requête
         *
         * @param callbackSuccess Fonction à exécuter
         */
        this.on200 = function on200(callbackSuccess) {
            onSuccessCallback = callbackSuccess;
        };

        /**
         * Permet de définir la fonction exécuter en cas d'erreur 404 de la requête
         *
         * @param callbackError Fonction à exécuter
         */
        this.on404 = function on404(callbackError) {
            onError['404'] = callbackError;
        };

        /**
         * Permet de définir la fonction exécuter en cas d'erreur 500 de la requête
         *
         * @param callbackError Fonction à exécuter
         */
        this.on500 = function on500(callbackError) {
            onError['500'] = callbackError;
        };

        /**
         * Permet de définir la fonction exécuter en cas d'erreur de la requête
         *
         * @param callbackError Fonction à exécuter
         */
        this.onError = function onError(callbackError) {
            onError.xxx = callbackError;
        };

        /**
         * Permet de définir la fonction exécuter en cas d'erreur 404 de la requête
         *
         * @param callbackError Fonction à exécuter
         */
        this.onPageNotFound = function onPageNotFound(callbackError) {
            this.on404(callbackError);
        };

        /**
         * Permet de définir la fonction exécuter en cas d'erreur 500 de la requête
         *
         * @param callbackError Fonction à exécuter
         */
        this.onServerError = function onServerError(callbackError) {
            this.on500(callbackError);
        };

        /**
         * Permet de définir la fonction à exécuter en cas de succès de la requête
         *
         * @param callbackSuccess Fonction à exécuter
         */
        this.onSuccess = function onSuccess(callbackSuccess) {
            this.on200(callbackSuccess);
        };

        /**
         * Envoi une requête de type POST
         *
         * @param {string} [source] URL à requêter
         * @param {function} [onSuccess] Fonction à exécuter en cas de succès
         */
        this.post = function post(source, onSuccess) {
            doRequest(this, GRA.ajax.const.method.POST, source, onSuccess);
        };

        /**
         * Prépare l'objet en fonction d'une source et d'une fonction à exécuter en cas de succès de la requête.
         * Si seulement une fonction est passée en paramètre, la source utilisée sera celle définie auparavant
         *
         * @param source URL à requêter
         * @param callbackSuccess Fonction à exécuter en cas de succès
         */
        this.prepare = function prepare(source, callbackSuccess) {
            if (source) {
                if (GRA.utils.is.callable(source)) {
                    this.onSuccess(source);
                } else {
                    this.setUrl(source);
                }
            }

            if (callbackSuccess) {
                this.onSuccess(callbackSuccess);
            }

            lastResultCode = null;
        };

        /**
         * Envoi une requête de type PUT
         *
         * @param {string} [source] URL à requêter
         * @param {function} [onSuccess] Fonction à exécuter en cas de succès
         */
        this.put = function put(source, onSuccess) {
            doRequest(this, GRA.ajax.const.method.PUT, source, onSuccess);
        };

        /**
         * Permet de retourner la chaîne de requête
         *
         * @returns {string}
         */
        this.queryString = function queryString() {
            var first = true,
                querystring = "",
                param,
                paramValue;

            if (sendOnlyOneParameter) {
                querystring = sendOnlyOneParameter + "=" + GRA.utils.ObjectUtils.stringify(parameters);
            } else {
                for (param in parameters) {
                    if (parameters.hasOwnProperty(param)) {
                        paramValue = parameters[param];

                        if (GRA.utils.is.object(paramValue) || GRA.utils.is.array(paramValue)) {
                            paramValue = GRA.utils.ObjectUtils.stringify(paramValue);
                        }

                        if (first) {
                            querystring += param + "=" + paramValue;
                        } else {
                            querystring += "&" + param + "=" + paramValue;
                        }
                    }
                }
            }

            return querystring;
        };

        /**
         *
         * @param method
         * @param source
         * @param onSuccess
         */
        this.send = function send(method, source, onSuccess) {
            if (method === GRA.ajax.const.method.GET) {
                doGetRequest(this, source, onSuccess);
            } else {
                doRequest(this, source, onSuccess);
            }
        };

        /**
         * Permet de spécifier à la requête d'envoyer les données encodées en JSON
         *
         * @param paramName Nom du paramètre qui sera envoyé
         */
        this.sendAsJson = function sendAsJson(paramName) {
            sendOnlyOneParameter = paramName;
        };

        /**
         * Permet de spécifier si la requête sera cross-domain
         *
         * @param {boolean} trueOrFalse
         */
        this.setCrossDomain = function setCrossDomain(trueOrFalse) {
            crossDomain = !!trueOrFalse;
        };

        /**
         * Permet de définir le type de réponse attendu par l'objet
         *
         * @param ajaxResponseType Type de réponse
         */
        this.setResponseType = function setResponseType(ajaxResponseType) {
            responseType = ajaxResponseType;
        };

        /**
         * Permet de définir l'URL destinaire de la requête
         *
         * @param urlSource URL à requêter
         */
        this.setUrl = function setUrl(urlSource) {
            url = urlSource;
        };
    };

}(GRA || {}));/**
 * Fichier src/ajax/factory.js
 *
 * @author D'oria Antony
 * @package GRA.ajax
 * @version 1.0
 */
(function (GRA) {

    GRA.ajax = GRA.ajax || {};

    /**
     * Classe Factory
     * Fabrique de requête Ajax
     *
     * @constructor
     */
    GRA.ajax.Factory = function Factory() {
        /**
         * Permet de créer une nouvelle requête Ajax
         *
         * @returns {Ajax}
         */
        this.createRequest = function createRequest() {
            return new GRA.ajax.Ajax();
        };

        /**
         * Permet de créer une nouvelle requête Ajax qui retournera une réponse
         * de type JSON
         *
         * @returns {Ajax}
         */
        this.createJsonRequest = function createJsonRequest() {
            var request = new GRA.ajax.Ajax();
            request.setResponseType(GRA.ajax.const.type.JSON);

            return request;
        };

        /**
         * Permet de créer une nouvelle requête Ajax qui retournera une réponse
         * de type XML
         *
         * @returns {Ajax}
         */
        this.createXmlRequest = function createXmlRequest() {
            var request = new GRA.ajax.Ajax();
            request.setResponseType(GRA.ajax.const.type.XML);

            return request;
        };
    };

    GRA.ajax.Factory = new GRA.ajax.Factory();
}(GRA || {}));(function (GRA) {

    GRA.component = GRA.component || {};

    /**
     *
     * @constructor
     */
    GRA.component.BackToTop = function BackToTop() {

        var selector = '#gra-back-to-top',
            html = [
                '<a id="gra-back-to-top" href="#" class="btn gra-button-bleu-edf btn-lg" role="button" title="Retour en haut de page" data-toggle="tooltip" data-placement="left">',
                '<span class="glyphicon glyphicon-chevron-up"></span></a>'
            ].join('');

        /**
         *
         */
        this.create = function create() {
            var body = $('body'),
                thisHtml = $('html'),
                thisWindow = $(window),
                backToTop;

            body.append(html);
            backToTop = $(selector);
            backToTop.tooltip('show');

            thisWindow.on('scroll', function () {
                if (5 * 10 < thisWindow.scrollTop()) {
                    backToTop.fadeIn();
                }
                else {
                    backToTop.fadeOut();
                }
            });

            backToTop.on('click', function (e) {
                e.preventDefault();

                backToTop.tooltip('hide');
                thisHtml.animate({
                    scrollTop: 0
                }, 5 * 10 * 10);
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getCssSelector = function getCssSelector() {
            return selector;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe Map
     * Représente une map (dictionnaire clé-valeur)
     *
     * @constructor
     */
    GRA.datastructure.Map = function Map() {
        var data = Object.create(null),
            length = 0;

        /**
         * Permet d'appliquer une fonction sur chaque paire clé/valeur de la Map.
         * La clé et la valeur seront passés en paramètre de la fonction.
         *
         * @param {function} callback Fonction à appeler sur chaque clé/valeur de la Map
         */
        this.forEach = function forEach(callback) {
            var property;

            for (property in data) {
                callback(property, data[property]);
            }
        };

        /**
         * Permet d'appliquer une fonction sur chaque clé de la Map
         *
         * @param {function} callback Fonction à appliquer
         */
        this.forEachKey = function forEachKey(callback) {
            var property;

            for (property in data) {
                callback(property);
            }
        };

        /**
         * Permet d'appliquer une fonction sur chaque valeur de la Map
         *
         * @param {function} callback Fonction à appliquer
         */
        this.forEachValue = function forEachValue(callback) {
            var property;

            for (property in data) {
                callback(data[property]);
            }
        };

        /**
         * Permet de vider la Map
         */
        this.clear = function clear() {
            var key;

            for (key in data) {
                delete data[key];
            }

            length = 0;
        };

        /**
         * Permet de savoir si la Map contient la clé passée en paramètre
         *
         * @param {string} key Clé à rechercher
         * @returns {boolean} TRUE si la clé est trouvée, FALSE sinon
         */
        this.containsKey = function containsKey(key) {
            return GRA.utils.ObjectUtils.own(key, data);
        };

        /**
         * Permet de savoir si la Map contient la valeur passée en paramètre
         *
         * @param {*} value Valeur à rechercher
         * @returns {boolean} TRUE si la valeur est trouvée, FALSE sinon
         */
        this.containsValue = function containsValue(value) {
            var values = this.values();

            return -1 !== GRA.utils.ArrayUtils.indexOf(value, values);
        };

        /**
         * Permet de retourner la valeur associée à la clé passée en paramètre
         *
         * @param {string} key Clé dans laquelle se trouve la valeur
         * @returns {*} Valeur contenue dans la clé
         */
        this.get = function get(key) {
            return data[key];
        };

        /**
         * Permet de savoir si la Map est vide ou non
         *
         * @returns {boolean} TRUE si la Map est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === length;
        };

        /**
         * Permet de retourner la liste des clés de la Map
         *
         * @returns {Array} Liste des clés de la Map
         */
        this.keys = function keys() {
            var key,
                keys = [];

            for (key in data) {
                keys.push(key);
            }

            return keys;
        };

        /**
         * Permet d'enregistrer une paire clé-valeur dans la Map
         *
         * @param {string} key Clé dans laquelle sera contenue la valeur
         * @param {*} value Valeur à insérer
         */
        this.put = function put(key, value) {
            data[key] = value;
            length += 1;
        };

        /**
         * Permet d'enregistrer la liste des couples dans la Map
         * Un couple est de la forme [clé, valeur]
         * La liste des couples est de la forme [[clé, valeur], [clé, valeur]]
         *
         * @param {Array} arrayOfCouple Liste des associations clé <=> valeur
         */
        this.putAll = function putAll(arrayOfCouple) {
            var couple,
                arrayLength = arrayOfCouple.length,
                index;

            for (index = 0; index < arrayLength; index += 1) {
                couple = arrayOfCouple[index];
                this.put(couple[0], couple[1]);
            }
        };

        /**
         * Permet de supprimer l'enregistrement dont la clé est passée en paramètre
         *
         * @param {string} key Clé à supprimer
         * @return {boolean} TRUE si l'élément a été supprimé, FALSE sinon
         */
        this.remove = function remove(key) {
            var removed = false;

            if (this.containsKey(key)) {
                delete data[key];
                length -= 1;
                removed = true;
            }

            return removed;
        };

        /**
         * Retourne la taille de la Map
         *
         * @returns {number} Taille de la map
         */
        this.size = function size() {
            return length;
        };

        /**
         * Permet de retourner la représentation textuelle (notation JSON) de la Map
         *
         * @returns {*|string} La représentation textuelle (notation JSON) de la Map
         */
        this.toString = function toStrong() {
            return GRA.utils.ObjectUtils.stringify(data);
        };
        
        /**
         * Permet de retourner les valeurs contenues dans la Map
         *
         * @returns {Array} Liste des valeurs contenues dans la Map
         */
        this.values = function values() {
            var key,
                values = [];

            for (key in data) {
                values.push(data[key]);
            }

            return values;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe Queue
     * Représente une file
     *
     * @constructor
     */
    GRA.datastructure.Queue = function Queue() {
        /**
         * @type {Array}
         */
        var data = [],
            /**
             * Itérateur d'une file
             *
             * @constructor
             */
            QueueIterator = function QueueIterator() {
                /**
                 * @type {GRA.datastructure.Queue}
                 */
                var collection = data,
                    /**
                     * @type {number}
                     */
                    index = data.length - 1;

                return {
                    current: function current() {
                        return collection[index];
                    },
                    /**
                     * Permet d'exécuter une fonction sur chaque élément de l'itérateur
                     *
                     * @param callback Fonction à exécuter sur chaque élément
                     */
                    forEach: function forEach(callback) {
                        var item;

                        for (item = this.first(); this.hasNext(); item = this.next()) {
                            callback(item);
                        }
                    },
                    /**
                     * Permet de retourner le premier élément de l'itérateur.
                     * L'itérateur pointera alors sur le deuxième élément du vector
                     *
                     * @returns {*} Premier élément de l'itérateur
                     */
                    first: function first() {
                        this.reset();

                        return this.next();
                    },
                    /**
                     * Permet de savoir si l'itérateur possède encore des éléments à parcourir
                     *
                     * @returns {boolean} TRUE si l'itérateur n'est pas à la fin, FALSE sinon
                     */
                    hasNext: function hasNext() {
                        return 0 <= index;
                    },
                    /**
                     * Permet de retourner le prochain élément de l'itérateur
                     *
                     * @returns {*}
                     */
                    next: function next() {
                        var element = collection[index];
                        index -= 1;

                        return element;
                    },
                    /**
                     * Réinitialise l'itérateur
                     */
                    reset: function reset() {
                        index = collection.length - 1;
                    }
                };
            };

        /**
         * Vide la file
         */
        this.clear = function clear() {
            GRA.utils.ArrayUtils.clear(data);
        };

        /**
         * Permet de créer une copie de la file actuelle
         *
         * @returns {GRA.datastructure.Queue} Clone de la file actuelle
         */
        this.clone = function clone() {
            var index,
                dataLenth = data.length - 1,
                cloned = new GRA.datastructure.Queue();

            for (index = dataLenth; 0 <= index; index -= 1) {
                cloned.enqueue(data[index]);
            }

            return cloned;
        };

        /**
         * Permet d'exécuter une fonction sur chaque élément de la file
         *
         * @param callback Fonction à exécuter sur chaque élément de la file
         */
        this.forEach = function forEach(callback) {
            GRA.utils.ArrayUtils.reverseForEach(data, callback);
        };

        /**
         * Permet de retourner l'élément en tête de file
         *
         * @returns {*} Element en tête de file
         */
        this.head = function head() {
            var head;

            if (!this.isEmpty()) {
                head = data[data.length - 1];
            }

            return head;
        };

        /**
         * Permet de savoir si la file est vide
         *
         * @returns {boolean} TRUE si la file est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === this.size();
        };

        /**
         * Permet de retourner un itérateur sur la file
         *
         * @returns {QueueIterator} Itérateur sur la file
         */
        this.iterator = function iterator() {
            return new QueueIterator();
        };

        /**
         * Permet d'ajouter la ou les valeurs dans la file
         *
         * @param values Valeur(s) à ajouter
         */
        this.enqueue = function enqueue(values) {
            data.unshift(values);
        };

        /**
         * Retire l'élément en tête de file
         *
         * @returns {*} L'élément défilé
         */
        this.dequeue = function dequeue() {
            return data.pop();
        };

        /**
         * Permet d'effectuer une opération de réduction sur la file
         *
         * @param {function} callback
         * @param {*} initialValue
         * @returns {*}
         */
        this.reduce = function reduce(callback, initialValue) {
            return data.reduceRight(callback, initialValue);
        };

        /**
         * Retourne la taille de la file
         *
         * @returns {Number} Taille de la file
         */
        this.size = function size() {
            return data.length;
        };

        /**
         * Permet de retourner l'élément en bout de file
         *
         * @returns {*} Element en bout de file
         */
        this.tail = function tail() {
            var tail;

            if (!this.isEmpty()) {
                tail = data[0];
            }

            return tail;
        };

        /**
         * Retourne les données de la file sous forme d'un tableau
         *
         * @returns {Array} Données de la file
         */
        this.toArray = function toArray() {
            return data;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe Stack
     * Représente une pile
     *
     * @constructor
     */
    GRA.datastructure.Stack = function Stack() {
        /**
         * @type {Array}
         */
        var data = [];

        /**
         * Vide la pile
         */
        this.clear = function clear() {
            GRA.utils.ArrayUtils.clear(data);
        };

        /**
         * Permet d'exécuter une fonction sur chaque élément de la pile
         *
         * @param callback Fonction à exécuter sur chaque élément de la pile
         */
        this.forEach = function forEach(callback) {
            GRA.utils.ArrayUtils.reverseForEach(data, callback);
        };

        /**
         * Permet de savoir si la pile est vide
         *
         * @returns {boolean} TRUE si la pile est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === this.size();
        };

        /**
         * Permet d'ajouter la ou les valeurs dans la pile
         *
         * @param values Valeur(s) à ajouter
         */
        this.push = function push(values) {
            data.push(values);
        };

        /**
         * Retire l'élément en haut de la pile
         *
         * @returns {T} L'élément dépilé
         */
        this.pop = function pop() {
            return data.pop();
        };

        /**
         * Retourne la taille de la pile
         *
         * @returns {Number} Taille de la pile
         */
        this.size = function size() {
            return data.length;
        };

        /**
         * Retourne les données de la pile sous forme d'un tableau
         *
         * @returns {Array} Données de la pile
         */
        this.toArray = function toArray() {
            return data;
        };

        /**
         * Permet de retourner l'élément en haut de pile
         *
         * @returns {*} Element en haut de pile
         */
        this.top = function top() {
            var top;

            if (!this.isEmpty()) {
                top = data[data.length - 1];
            }

            return top;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe BinarySearchTree
     * Représente un Arbre Binaire de Recherche
     *
     * @constructor
     */
    GRA.datastructure.BinarySearchTree = function BinarySearchTree() {
        var Node = function Node(nodeKey, nodeValue, isRoot) {
            var root = !!isRoot,
                nodeId = nodeKey,
                data = nodeValue,
                leftNode,
                rightNode;

            /**
             *
             * @returns {*}
             */
            this.id = function id() {
                return nodeId;
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insert = function insert(key, value, comparator) {
                var comparison = comparator(nodeId, key);

                if (0 <= comparison) {
                    this.insertLeft(key, value, comparator);
                } else {
                    this.insertRight(key, value, comparator);
                }
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insertLeft = function insertLeft(key, value, comparator) {
                if (leftNode) {
                    leftNode.insert(key, value, comparator);
                } else {
                    leftNode = new Node(key, value);
                }
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insertRight = function insertRight(key, value, comparator) {
                if (rightNode) {
                    rightNode.insert(key, value, comparator);
                } else {
                    rightNode = new Node(key, value);
                }
            };

            /**
             *
             * @returns {boolean}
             */
            this.isLeaf = function isLeaf() {
                return !left && !right;
            };

            /**
             *
             * @returns {boolean}
             */
            this.isRoot = function isRoot() {
                return root;
            };

            /**
             *
             * @returns {*}
             */
            this.left = function left() {
                return leftNode;
            };

            /**
             *
             * @returns {*}
             */
            this.right = function right() {
                return rightNode;
            };
            
            /**
             *
             * @param node
             */
            this.setLeftNode = function setLeftNode(node) {
                leftNode = node;
            };

            /**
             *
             * @param node
             */
            this.setRightNode = function setRightNode(node) {
                rightNode = node;
            };

            /**
             *
             * @returns {*}
             */
            this.value = function value() {
                return data;
            };
        },
        compare = function compare(valA, valB) {
            var result = 1;

            if (valA === valB) {
                result = 0;
            } else if (valA < valB) {
                result = -1;
            }

            return result;
        },
        rootNode,
        nodeLength = 0,
        lastSearchIterations = 0,
        strategies = {
            'depth_first': function depthFirst(needle, node) {
                var result = null,
                    rootId = node.id(),
                    left,
                    right;

                lastSearchIterations += 1;

                if (needle === rootId) {
                    result = node.value();
                } else if (needle < rootId && node.left()) {
                    left = node.left();
                    result = this.depth_first(needle, left);
                } else if (node.right()) {
                    right = node.right();
                    result = this.depth_first(needle, right);
                }

                return result;
            }
        };

        this.DEPTH_FIRST = 'depth_first';

        /**
         *
         * @param key
         * @param value
         */
        this.add = function add(key, value) {
            var comparison,
                rootId;

            if (this.isEmpty()) {
                this.setRoot(key, value);
            } else {
                rootId = rootNode.id();
                comparison = compare(rootId, key);

                if (0 <= comparison) {
                    rootNode.insertLeft(key, value, compare);
                } else {
                    rootNode.insertRight(key, value, compare);
                }
            }

            nodeLength += 1;

            return this;
        };

        this.countNodes = function countNodes() {
            return nodeLength;
        };

        this.countIterations = function countIterations() {
            return lastSearchIterations;
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return !rootNode;
        };

        /**
         *
         * @returns {*}
         */
        this.root = function root() {
            return rootNode;
        };

        /**
         *
         * @param needle
         * @param strategy
         * @returns {*}
         */
        this.search = function search(needle, strategy) {
            var result;

            lastSearchIterations = 0;
            if (strategies.hasOwnProperty(strategy)) {
                result = strategies[strategy](needle, rootNode);
            }

            return result;
        };

        /**
         *
         * @param compareFunction
         */
        this.setComparator = function setComparator(compareFunction) {
            compare = compareFunction;
        };

        /**
         *
         * @param nodeId
         * @param nodeValue
         */
        this.setRoot = function setRoot(nodeId, nodeValue) {
            rootNode = new Node(nodeId, nodeValue, true);

            return this;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe Vector.
     * Représente un Vector
     *
     * @constructor
     */
    GRA.datastructure.Vector = function Vector() {
        /**
         * @type {Array}
         */
        var data = [],
            /**
             * Permet de créer un itérateur sur le vector
             * passé en paramètre
             *
             * @param {Vector} vector Vecteur à itérer
             * @constructor
             */
            VectorIterator = function VectorIterator(vector) {
                /**
                 * @type {number}
                 */
                var index = 0,
                    /**
                     * @type {GRA.datastructure.Vector}
                     */
                    collection = vector;

                /**
                 * Permet d'exécuter une fonction sur chaque élément de l'itérateur
                 *
                 * @param callback Fonction à exécuter sur chaque élément
                 */
                this.forEach = function forEach(callback) {
                    var item;

                    for (item = this.first(); this.hasNext(); item = this.next()) {
                        callback(item);
                    }
                };

                /**
                 * Permet de retourner le premier élément de l'itérateur.
                 * L'itérateur pointera alors sur le deuxième élément du vector
                 *
                 * @returns {*} Premier élément de l'itérateur
                 */
                this.first = function first() {
                    this.reset();

                    return this.next();
                };

                /**
                 * Permet de savoir si l'itérateur possède encore des éléments à parcourir
                 *
                 * @returns {boolean} TRUE si l'itérateur n'est pas à la fin, FALSE sinon
                 */
                this.hasNext = function hasNext() {
                    return collection.size() >= index;
                };

                /**
                 * Permet de retourner le prochain élément de l'itérateur
                 *
                 * @returns {*}
                 */
                this.next = function next() {
                    var element = collection.elementAt(index);
                    index += 1;

                    return element;
                };

                /**
                 * Réinitialise l'itérateur
                 */
                this.reset = function reset() {
                    index -= index;
                };
            };

        /**
         * Permet d'ajouter des éléments dans le Vector
         *
         * @param {...*}
         */
        this.add = function add() {
            var argIndex;

            for (argIndex = 0; argIndex < arguments.length; argIndex += 1) {
                data.push(arguments[argIndex]);
            }
        };

        /**
         * Permet d'insérer une liste d'éléments dans le Vector
         *
         * @param {Array} arrayOfData Tableau de données à insérer
         */
        this.addAll = function addAll(arrayOfData) {
            var index,
                totalData = arrayOfData.length;

            if (!GRA.utils.is.array(arrayOfData)) {
                throw new TypeError("La méthode Vector::addAll() ne prend en paramètre qu'un unique tableau.");
            }

            for (index = 0; index < totalData; index += 1) {
                this.add(arrayOfData[index]);
            }
        };

        /**
         * Permet de vider le vector
         */
        this.clear = function clear() {
            GRA.utils.ArrayUtils.clear(data);
        };

        /**
         * Permet de retourner l'élément se trouvant à l'indice passé en paramètre
         *
         * @param index Indice de l'élément à retourner
         * @returns {*} Element situé à l'indice fourni en paramètre
         */
        this.elementAt = function elementAt(index) {
            var element;

            if (index < this.size()) {
                element = data[index];
            }

            return element;
        };

        /**
         * Permet de retourner le premier élément du vector
         *
         * @returns {*} Premier élément du vector
         */
        this.firstElement = function firstElement() {
            var element;

            if (!this.isEmpty()) {
                element = data[0];
            }

            return element;
        };

        /**
         * Permet d'exécuter une fonction sur chaque élément du vector
         *
         * @param callback Fonction à exécuter sur chaque élément du vector
         */
        this.forEach = function forEach(callback) {
            GRA.utils.ArrayUtils.forEach(data, callback);
        };

        /**
         * Permet de savoir si le vector contient l'élément passé en paramètre
         *
         * @param element Elément à chercher
         * @returns {boolean} TRUE si l'élément est contenu dans le vector, FALSE sinon
         */
        this.has = function has(element) {
            return -1 < this.indexOf(element);
        };

        /**
         * Permet de retourner l'indice de l'élément fourni en paramètre.
         * Si l'élément n'est pas trouvé, cette fonction retournera -1.
         *
         * @param {*} element Element dont l'indice est à rechercher
         * @returns {number} Position de l'élément dans le vector
         */
        this.indexOf = function indexOf(element) {
            return GRA.utils.ArrayUtils.indexOf(element, data);
        };

        /**
         * Permet de savoir si le vector est vide
         *
         * @returns {boolean} TRUE si le vector est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === this.size();
        };

        /**
         * Permet de retourner un itérateur sur le vector
         *
         * @returns {VectorIterator} Itérateur
         */
        this.iterator = function iterator() {
            return new VectorIterator(this);
        };

        /**
         * Permet de retourner une chaîne de caractères dont chaque élément du vector sera
         * concaténé ensemble. Si le délimiteur est spécifié, le délimiteur sera concaténé entre deux éléments.
         * Si le délimiteur n'est pas spécifié, les éléments seront concaténés via une virgule.
         *
         * @param {string} [delimiter] Delimiteur
         * @returns {string} Element concaténé sous forme de chaîne de caractères
         */
        this.join = function join(delimiter) {
            return data.join(delimiter);
        };

        /**
         * Permet de retourner le dernier élément du vector
         *
         * @returns {*} Le dernier élément du vector
         */
        this.lastElement = function lastElement() {
            var element;

            if (!this.isEmpty()) {
                element = data[this.size() - 1];
            }

            return element;
        };

        /**
         * Permet de supprimer l'élément fourni en paramètre du vector
         *
         * @param element Elément à supprimer
         * @returns {*} Le résultat de la suppression
         */
        this.remove = function remove(element) {
            var index = GRA.utils.ArrayUtils.indexOf(element, data);

            return this.removeElementAt(index);
        };

        /**
         * Permet de supprimer les éléments contenus dans le tableau fourni en paramètre du vector
         *
         * @param array Liste d'éléments à supprimer
         */
        this.removeAll = function removeAll(array) {
            var index;

            if (!GRA.utils.is.array(array)) {
                throw new Error('Le paramètre de Vector::removeAll() doit être un tableau.');
            }

            for (index = 0; index < array.length; index += 1) {
                this.remove(array[index]);
            }
        };

        /**
         * Permet de supprimer l'élément se trouvant à l'indice fourni en paramètre
         *
         * @param index Indice de l'élément à supprimer
         * @returns {*} L'élément supprimé si la suppression a été effectuée, undefined sinon
         */
        this.removeElementAt = function removeElementAt(index) {
            var element;

            if (index < this.size()) {
                element = data.splice(index, 1);
            }

            return element;
        };

        /**
         * Permet d'inverser les éléments du vector
         */
        this.reverse = function reverse() {
            data.reverse();
        };

        /**
         * Permet de retourner la taille du vector
         *
         * @returns {Number} Taille du vector
         */
        this.size = function size() {
            return data.length;
        };

        /**
         * Permet d'ordonner les éléments du vector en fonction de la fonction passée en paramètre.
         * La fonction recevra en paramètre deux éléments à comparer
         *
         * @param {function} sortFunction Fonction de tri
         */
        this.sort = function sort(sortFunction) {
            data.sort(sortFunction);
        };

        /**
         * Permet d'ordonner les éléments du vector par ordre croissant
         */
        this.sortAsc = function sortAsc() {
            data.sort();
        };

        /**
         * Permet d'ordonner les éléments du vector par ordre décroissant
         */
        this.sortDesc = function sortDesc() {
            var sortInt = function sortInt(a, b) {
                    return b - a;
                },
                sortString = function sortString(a, b) {
                    return b.toString().localeCompare(a);
                };

            if (isNaN(data[0])) {
                data.sort(sortString);
            } else {
                data.sort(sortInt);
            }
        };

        /**
         * Permet de retourner le vector sous la forme d'un tableau
         *
         * @returns {Array} Vector sous forme d'un tableau
         */
        this.toArray = function toArray() {
            return data;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Collection = function Collection() {

        var elements = [],
            handler = new GRA.dom.Element(),
            arrayUtils = GRA.utils.ArrayUtils;

        /**
         *
         * @param className
         */
        this.addClass = function addClass(className) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.addClass(className);
            });
        };

        /**
         *
         * @param html
         */
        this.after = function after(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.after(html);
            });
        };

        /**
         *
         * @param html
         */
        this.append = function append(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.append(html);
            });
        };

        /**
         *
         * @param html
         */
        this.before = function before(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.before(html);
            });
        };

        /**
         *
         * @param htmlElements
         */
        this.decorate = function decorate(htmlElements) {
            elements = htmlElements;
        };

        /**
         *
         * @param callback
         */
        this.each = function each(callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                callback(handler);
            });
        };

        /**
         *
         */
        this.empty = function empty() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.empty();
            });
        };

        /**
         *
         * @param attributeName
         * @returns {Array}
         */
        this.getAttribute = function getAttribute(attributeName) {
            var attributes = [],
                attribute;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                attribute = handler.getAttribute(attributeName);
                attributes.push(attribute);
            });

            return attributes;
        };

        /**
         *
         * @param name
         * @returns {Array}
         */
        this.getData = function getData(name) {
            return this.getAttribute('data-' + name);
        };

        /**
         *
         * @returns {string}
         */
        this.getHtml = function getHtml() {
            var html = [],
                part;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                part = handler.getHtml();
                html.push(part);
            });

            return html.join(' ');
        };

        /**
         *
         * @returns {string}
         */
        this.getText = function getText() {
            var text = [],
                part;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                part = handler.getText();
                text.push(part);
            });

            return text.join(' ');
        };

        /**
         *
         * @returns {*}
         */
        this.getParent = function getParent() {
            var parent = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                parent = handler.getParent();
            }

            return parent;
        };

        /**
         *
         * @returns {*}
         */
        this.getPosition = function getPosition() {
            var position = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                position = handler.getPosition();
            }

            return position;
        };

        /**
         *
         * @returns {*}
         */
        this.getPositionRelative = function getPositionRelative() {
            var position = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                position = handler.getPositionRelative();
            }

            return position;
        };

        /**
         *
         * @returns {boolean}
         */
        this.hasClass = function hasClass() {
            return false;
        };

        /**
         *
         */
        this.hide = function hide() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.hide();
            });
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.off = function off(eventName, callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.off(eventName, callback);
            });
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.on(eventName, callback);
            });
        };

        /**
         *
         * @param html
         */
        this.prepend = function prepend(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.prepend(html);
            });
        };

        /**
         *
         */
        this.remove = function remove() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.remove();
            });

            elements = [];
        };

        /**
         *
         * @param attributeName
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.removeAttribute(attributeName);
            });
        };

        /**
         *
         * @param className
         */
        this.removeClass = function removeClass(className) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.removeClass(className);
            });
        };

        /**
         *
         * @param name
         */
        this.removeData = function removeData(name) {
            this.removeAttribute('data-' + name);
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setAttribute(attributeName, attributeValue);
            });
        };

        /**
         *
         * @param name
         * @param value
         */
        this.setData = function setData(name, value) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setData(name, value);
            });
        };

        /**
         *
         * @param html
         */
        this.setHtml = function setHtml(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setHtml(html);
            });
        };

        /**
         *
         * @param text
         */
        this.setText = function setText(text) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setText(text);
            });
        };

        /**
         *
         */
        this.show = function show() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.show();
            });
        };

        /**
         * 
         * @param eventName
         */
        this.trigger = function trigger(eventName) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.trigger(eventName);
            });
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Element = function Element() {

        var element = document;

        /**
         *
         * @param className
         */
        this.addClass = function addClass(className) {
            if (!GRA.utils.StringUtils.has(className, element.className)) {
                element.className += ' ' + className;
            }
        };

        /**
         *
         * @param html
         */
        this.after = function after(html) {
            element.insertAdjacentHTML('afterend', html);
        };

        /**
         *
         * @param html
         */
        this.append = function append(html) {
            element.insertAdjacentHTML('beforeend', html);
        };

        /**
         *
         * @param html
         */
        this.before = function before(html) {
            element.insertAdjacentHTML('beforebegin', html);
        };

        /**
         *
         * @returns {Node}
         */
        this.clone = function clone() {
            return element.cloneNode(true);
        };

        /**
         *
         * @param child
         * @returns {boolean|*}
         */
        this.contains = function contains(child) {
            return element !== child && element.contains(child);
        };

        /**
         *
         * @param htmlElement
         */
        this.decorate = function decorate(htmlElement) {
            element = htmlElement;
        };

        /**
         *
         * @param callback
         */
        this.each = function each(callback) {
            callback(element);
        };

        /**
         *
         */
        this.empty = function empty() {
            element.innerHTML = '';
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return '' === element.innerHTML;
        };

        /**
         *
         * @param attributeName
         * @returns {*|*|string|string}
         */
        this.getAttribute = function getAttribute(attributeName) {
            return element.getAttribute(attributeName);
        };

        /**
         *
         * @param name
         * @returns {*|*|string|string}
         */
        this.getData = function getData(name) {
            return this.getAttribute('data-' + name);
        };

        /**
         *
         * @returns {*|HTMLDocument}
         */
        this.getElementDecorated = function getElementDecorated() {
            return element;
        };

        /**
         *
         * @returns {string|*}
         */
        this.getHtml = function getHtml() {
            return element.innerHTML;
        };

        /**
         *
         * @returns {*}
         */
        this.getText = function getText() {
            return element.textContent;
        };

        /**
         *
         * @returns {GRA.dom.Element}
         */
        this.getParent = function getParent() {
            element = element.parentNode;

            return this;
        };

        /**
         *
         * @returns {{left: (number|Number), top: (number|Number)}}
         */
        this.getPosition = function getPosition() {
            return {
                left: element.offsetLeft,
                top: element.offsetTop
            };
        };

        /**
         *
         * @returns {ClientRect}
         */
        this.getPositionRelative = function getPositionRelative() {
            return element.getBoundingClientRect();
        };

        /**
         *
         * @param className
         * @returns {boolean}
         */
        this.hasClass = function hasClass(className) {
            var regex = new RegExp('(^| )' + className + '( |$)', 'gi');

            return regex.test(element.className);
        };

        /**
         *
         */
        this.hide = function hide() {
            element.style.display = 'none';
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.off = function off(eventName, callback) {
            element.removeEventListener(eventName, callback);
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            element.addEventListener(eventName, callback);
        };

        /**
         *
         * @param html
         */
        this.prepend = function prepend(html) {
            element.insertBefore(html, element.firstChild);
        };

        /**
         *
         */
        this.remove = function remove() {
            element.parentNode.removeChild(element);
            element = document;
        };

        /**
         *
         * @param className
         */
        this.removeClass = function removeClass(className) {
            var toArray = className.split(' '),
                toRegex = toArray.join('|'),
                regex = new RegExp('(^|\\b)' + toRegex + '(\\b|$)', 'gi');

            element.className = element.className.replace(regex, ' ');
        };

        /**
         *
         * @param attributeName
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            element.removeAttribute(attributeName);
        };

        /**
         *
         * @param name
         */
        this.removeData = function removeData(name) {
            this.removeAttribute('data-' + name);
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue) {
            element.setAttribute(attributeName, attributeValue);
        };

        /**
         *
         * @param name
         * @param value
         */
        this.setData = function setDate(name, value) {
            element.setAttribute('data-' + name, value);
        };

        /**
         *
         * @param html
         */
        this.setHtml = function setHtml(html) {
            element.innerHTML = html;
        };

        /**
         *
         * @param text
         */
        this.setText = function setText(text) {
            element.textContent = text;
        };

        /**
         *
         */
        this.show = function show() {
            element.style.display = '';
        };

        /**
         * 
         * @param eventName
         */
        this.trigger = function trigger(eventName) {
            var event = document.createEvent('HTMLEvents');

            event.initEvent(eventName, true, false);
            element.dispatchEvent(event);
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Finder = function Finder() {

        var handlers = {
                'element': new GRA.dom.Element(),
                'collection': new GRA.dom.Collection()
            },
            handler = 'element',
            setHandler = function setHandler(htmlElements) {
                if (1 === htmlElements.length) {
                    handlers.element.decorate(htmlElements[0]);
                    handler = 'element';
                } else {
                    handlers.collection.decorate(htmlElements);
                    handler = 'collection';
                }
            };

        /****************/
        /* Recherche    */
        /****************/

        /**
         *
         * @param selector
         * @returns {number}
         */
        this.count = function count(selector) {
            var from = handlers.element.getElementDecorated();

            return from.querySelectorAll(selector).length;
        };

        /**
         *
         * @param className
         * @returns {number}
         */
        this.countByClass = function countByClass(className) {
            var from = handlers.element.getElementDecorated();

            return from.getElementsByClassName(className).length;
        };

        /**
         *
         * @param selector
         * @returns {GRA.dom.Finder}
         */
        this.find = function find(selector) {
            var from = handlers.element.getElementDecorated(),
                htmlElements = from.querySelectorAll(selector);

            setHandler(htmlElements);

            return this;
        };

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.findByClass = function findByClass(className) {
            var from = handlers.element.getElementDecorated(),
                htmlElements = from.getElementsByClassName(className);

            setHandler(htmlElements);

            return this;
        };

        /**
         *
         * @param id
         * @returns {GRA.dom.Finder}
         */
        this.findById = function findById(id) {
            var from = handlers.element.getElementDecorated(),
                htmlElement = from.getElementById(id);

            handlers.element.decorate(htmlElement);
            handler = 'element';

            return this;
        };

        /**
         *
         * @param selector
         * @returns {GRA.dom.Finder}
         */
        this.findOne = function findOne(selector) {
            var from = handlers.element.getElementDecorated(),
                htmlElement = from.querySelector(selector);

            handlers.element.decorate(htmlElement);
            handler = 'element';

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.reset = function reset() {
            return this.searchFromDocument();
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.searchFromBody = function searchFromBody() {
            handlers.element.decorate(document.body);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.searchFromDocument = function searchFromDocument() {
            handlers.element.decorate(document);

            return this;
        };


        /****************/
        /* Manipulation */
        /****************/

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.addClass = function addClass(className) {
            handlers[handler].addClass(className);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.after = function after(html) {
            handlers[handler].after(html);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.append = function append(html) {
            handlers[handler].append(html);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.before = function before(html) {
            handlers[handler].before(html);

            return this;
        };

        /**
         *
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.each = function each(callback) {
            handlers[handler].each(callback);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.empty = function empty() {
            handlers[handler].empty();

            return this;
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @returns {*|string}
         */
        this.getAttribute = function getAttribute(attributeName, attributeValue) {
            return handlers[handler].getAttribute(attributeName, attributeValue);
        };

        /**
         *
         * @param name
         * @returns {string|*}
         */
        this.getData = function getData(name) {
            return handlers[handler].getData(name);
        };

        /**
         *
         * @returns {*}
         */
        this.getHtml = function getHtml() {
            return handlers[handler].getHtml();
        };

        /**
         *
         * @returns {*}
         */
        this.getText = function getText() {
            return handlers[handler].getText();
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.getParent = function getParent() {
            var parent = handlers[handler].getParent(),
                elementDecorated = parent.getElementDecorated();
            handler = 'element';
            handlers[handler].decorate(elementDecorated);

            return this;
        };

        /**
         *
         * @returns {*|{top, left}|{left, top}}
         */
        this.getPosition = function getPosition() {
            return handlers[handler].getPosition();
        };

        /**
         *
         */
        this.getPositionRelative = function getPositionRelative() {
            return handlers[handler].getPositionRelative();
        };

        /**
         *
         * @param className
         * @returns {*}
         */
        this.hasClass = function hasClass(className) {
            return handlers[handler].hasClass(className);
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.hide = function hide() {
            handlers[handler].hide();

            return this;
        };

        /**
         *
         * @param eventName
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.off = function off(eventName, callback) {
            handlers[handler].off(eventName, callback);

            return this;
        };

        /**
         *
         * @param eventName
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.on = function on(eventName, callback) {
            handlers[handler].on(eventName, callback);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.prepend = function prepend(html) {
            handlers[handler].prepend(html);

            return this;
        };

        /**
         *
         */
        this.remove = function remove() {
            handlers[handler].remove();
        };

        /**
         *
         * @param attributeName
         * @returns {GRA.dom.Finder}
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            handlers[handler].removeAttribute(attributeName);

            return this;
        };

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.removeClass = function removeClass(className) {
            handlers[handler].removeClass(className);

            return this;
        };

        /**
         *
         * @param name
         * @returns {GRA.dom.Finder}
         */
        this.removeData = function removeData(name) {
            handlers[handler].removeData(name);

            return this;
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @returns {GRA.dom.Finder}
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue) {
            handlers[handler].setAttribute(attributeName, attributeValue);

            return this;
        };

        /**
         *
         * @param name
         * @param value
         * @returns {GRA.dom.Finder}
         */
        this.setData = function setData(name, value) {
            handlers[handler].setData(name, value);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.setHtml = function setHtml(html) {
            handlers[handler].setHtml(html);

            return this;
        };

        /**
         *
         * @param text
         * @returns {GRA.dom.Finder}
         */
        this.setText = function setText(text) {
            handlers[handler].setText(text);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.show = function show() {
            handlers[handler].show();

            return this;
        };

        /**
         * 
         * @param eventName
         * @returns {GRA.dom.Finder}
         */
        this.trigger = function trigger(eventName) {
            handlers[handler].trigger(eventName);

            return this;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     * Classe JQueryProxy
     * Proxy de JQuery
     *
     * @constructor
     */
    GRA.dom.JQueryProxy = function JQueryProxy() {
        /**
         * 
         * @param className
         * @param selector
         * @returns {*}
         */
        this.addClass = function addClass(className, selector) {
            var elements = $(selector);
            return elements.addClass(className);
        };

        /**
         *
         * @param htmlElement
         * @param selector
         * @returns {*}
         */
        this.append = function append(htmlElement, selector) {
            var elements = $(selector);
            return elements.append(htmlElement);
        };

        /**
         *
         * @param selector
         * @returns {number|jQuery}
         */
        this.count = function count(selector) {
            return $(selector).length;
        };

        /**
         *
         * @param cssClass
         * @returns {number|jQuery}
         */
        this.countByClass = function countByClass(cssClass) {
            return $('.' + cssClass).length;
        };

        /**
         *
         * @param selector
         * @returns {*|jQuery|HTMLElement}
         */
        this.find = function find(selector) {
            return $(selector);
        };

        /**
         *
         * @param cssClass
         * @returns {*|jQuery|HTMLElement}
         */
        this.findByClass = function findByClass(cssClass) {
            return $('.' + cssClass);
        };

        /**
         *
         * @param selectorId
         * @returns {*|jQuery|HTMLElement}
         */
        this.findById = function findById(selectorId) {
            return $('#' + selectorId);
        };

        /**
         *
         * @param selector
         * @param callback
         */
        this.forEach = function forEach(selector, callback) {
            var elements = $(selector);
            elements.each(callback);
        };

        /**
         *
         * @param attributeName
         * @param selector
         * @returns {*}
         */
        this.getAttribute = function getAttribute(attributeName, selector) {
            var elements = $(selector);
            return elements.attr(attributeName);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getChildren = function getChildren(selector) {
            var elements = $(selector);
            return elements.children();
        };

        /**
         *
         * @param dataKey
         * @param selector
         * @returns {*}
         */
        this.getData = function getData(dataKey, selector) {
            var elements = $(selector);
            return elements.data(dataKey);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getHtml = function getHtml(selector) {
            var elements = $(selector);
            return elements.html();
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getNodeName = function getNodeName(selector) {
            return this.getProperty('tagName', selector);
        };

        /**
         *
         * @param selector
         * @returns {*|{top, left}}
         */
        this.getOffset = function getOffset(selector) {
            var elements = $(selector);
            return elements.offset();
        };

        /**
         *
         * @param selector
         * @param parentName
         * @returns {*}
         */
        this.getParent = function getParent(selector, parentName) {
            var elements = $(selector);
            return elements.parent(parentName);
        };

        /**
         *
         * @param selector
         * @returns {*|{top, left}}
         */
        this.getPosition = function getPosition(selector) {
            var elements = $(selector);
            return elements.position();
        };

        /**
         *
         * @param propertyName
         * @param selector
         * @returns {*}
         */
        this.getProperty = function getProperty(propertyName, selector) {
            var elements = $(selector);
            return elements.prop(propertyName);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getText = function getText(selector) {
            var elements = $(selector);
            return elements.text();
        };

        /**
         *
         * @param input
         * @returns {*}
         */
        this.getValue = function getValue(input) {
            var elements = $(input);
            return elements.val();
        };

        /**
         *
         * @param className
         * @param selector
         * @returns {*}
         */
        this.hasClass = function hasClass(className, selector) {
            var elements = $(selector);
            return elements.hasClass(className);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.hide = function hide(selector) {
            var elements = $(selector);
            return elements.hide();
        };

        /**
         *
         * @param inputCheckbox
         * @returns {*}
         */
        this.isChecked = function isChecked(inputCheckbox) {
            var elements = $(inputCheckbox);
            return elements.is(':checked');
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.isVisible = function isVisible(selector) {
            var elements = $(selector);
            return elements.is(':visible');
        };

        /**
         *
         * @param htmlElement
         * @param selector
         * @returns {*}
         */
        this.prepend = function prepend(htmlElement, selector) {
            var elements = $(selector);
            return elements.prepend(htmlElement);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.remove = function remove(selector) {
            var elements = $(selector);
            return elements.remove();
        };

        /**
         *
         * @param className
         * @param selector
         * @returns {*}
         */
        this.removeClass = function removeClass(className, selector) {
            var elements = $(selector);
            return elements.removeClass(className);
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @param selector
         * @returns {*}
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue, selector) {
            var elements = $(selector);
            return elements.attr(attributeName, attributeValue);
        };

        /**
         *
         * @param dataKey
         * @param dataValue
         * @param selector
         * @returns {*}
         */
        this.setData = function setData(dataKey, dataValue, selector) {
            var elements = $(selector);
            return elements.data(dataKey, dataValue);
        };

        /**
         *
         * @param htmlContent
         * @param selector
         * @returns {*}
         */
        this.setHtml = function setHtml(htmlContent, selector) {
            var elements = $(selector);
            return elements.html(htmlContent);
        };

        /**
         *
         * @param propertyName
         * @param propertyValue
         * @param selector
         * @returns {*}
         */
        this.setProperty = function setProperty(propertyName, propertyValue, selector) {
            var elements = $(selector);
            return elements.prop(propertyName, propertyValue);
        };

        /**
         *
         * @param textContent
         * @param selector
         * @returns {*}
         */
        this.setText = function setText(textContent, selector) {
            var elements = $(selector);
            return elements.text(textContent);
        };

        /**
         *
         * @param value
         * @param input
         * @returns {*}
         */
        this.setValue = function setValue(value, input) {
            var elements = $(input);
            return elements.val(value);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.show = function show(selector) {
            var elements = $(selector);
            return elements.show();
        };
    };

    GRA.dom.JQueryProxy = new GRA.dom.JQueryProxy();

}(GRA || {}));(function (GRA) {

    GRA.form = GRA.form || {};

    /**
     * Classe Form
     *
     * @constructor
     */
    GRA.form.Form = function Form() {
        var dom = GRA.dom.JQueryProxy,
            model,
            events = Object.create(null),
            inputs = Object.create(null),
            selects = Object.create(null),
            checkInputs = function checkInputs() {
                var properties = Object.keys(inputs),
                    totalProperties = properties.length,
                    index = 0,
                    result = true;

                while (result && index < totalProperties) {
                    result = result && inputs[properties[index]].valid;
                    index += 1;
                }

                return result;
            },
            checkSelects = function selectInputs() {
                var properties = Object.keys(selects),
                    totalProperties = properties.length,
                    index = 0,
                    result = true;

                while (result && index < totalProperties) {
                    result = result && selects[properties[index]].valid;
                    index += 1;
                }

                return result;
            };

        events['model.attribute.update'] = function (attribute) {
            var element,
                objectUtils = GRA.utils.ObjectUtils,
                value = model.attribute(attribute);

            if (objectUtils.own(attribute, inputs)) {
                element = inputs[attribute];
                element.input.val(value);
                element.input.trigger('keyup');
            } else if (objectUtils.own(attribute, selects)) {
                element = selects[attribute];
                element.select.val(value);
                element.select.trigger('change');
            }
        };

        /**
         *
         * @param modelProperty
         * @param inputSelector
         * @param rules
         */
        this.addInput = function addInput(modelProperty, inputSelector, rules) {
            var input = dom.find(inputSelector),
                form = this;

            inputs[modelProperty] = {
                input: input,
                rules: rules,
                valid: false
            };

            input.on('keyup', function () {
                var validator = form.validator,
                    value = this.value;

                if (model) {
                    model.attribute(modelProperty, value);
                }

                if (validator.validate(value, rules)) {
                    inputs[modelProperty].valid = true;
                    form.dispatch('input.valid', [this]);
                } else {
                    inputs[modelProperty].valid = false;
                    form.dispatch('input.invalid', [this]);
                }
            });
        };

        /**
         *
         * @param modelProperty
         * @param selectSelector
         * @param nullValue
         */
        this.addSelect = function addSelect(modelProperty, selectSelector, nullValue) {
            var select = dom.find(selectSelector),
                form = this;

            selects[modelProperty] = {
                select: select,
                deny: nullValue,
                valid: false
            };

            select.on('change', function () {
                var value = this.value;

                if (model) {
                    model.attribute(modelProperty, value);
                }

                if (value === nullValue) {
                    selects[modelProperty].valid = false;
                    form.dispatch('select.invalid', [this]);
                } else {
                    selects[modelProperty].valid = true;
                    form.dispatch('select.valid', [this]);
                }
            });
        };

        /**
         *
         * @param event
         * @param parameters
         */
        this.dispatch = function dispatch(event, parameters) {
            if (GRA.utils.ObjectUtils.own(event, events)) {
                events[event].apply(null, parameters || []);
            }
        };

        /**
         *
         * @returns {boolean}
         */
        this.isValid = function isValid() {
            var result = checkInputs();

            if (result) {
                result = result && checkSelects();
            }

            return result;
        };

        /**
         *
         * @param event
         * @param callback
         */
        this.on = function on(event, callback) {
            events[event] = callback;
        };

        /**
         *
         * @param modelObject
         */
        this.setModel = function setModel(modelObject) {
            if (!model || model.getName() !== modelObject.getName()) {
                model = modelObject;
                model.attachTo(this);
            }
        };

        /**
         * @type {GRA.form.Validator}
         */
        this.validator = new GRA.form.Validator();
    };

}(GRA || {}));(function (GRA) {

    GRA.form = GRA.form || {};

    /**
     *
     * @constructor
     */
    GRA.form.Validator = function Validator() {
        var rules = new GRA.datastructure.Map(),
            errors = new GRA.datastructure.Stack();

        /**
         *
         * @param ruleName
         * @param checker
         * @param instruction
         */
        this.addRule = function addRule(ruleName, checker, instruction) {
            rules.put(ruleName, {
                check: checker,
                instruction: instruction
            });
        };

        /**
         *
         * @returns {GRA.datastructure.Stack}
         */
        this.getErrors = function getErrors() {
            return errors;
        };

        /**
         *
         * @returns {boolean}
         */
        this.hasErrors = function hasErrors() {
            return !errors.isEmpty();
        };

        /**
         *
         * @param value
         * @param arrayOfRules
         * @returns {boolean}
         */
        this.validate = function validate(value, arrayOfRules) {
            GRA.utils.ArrayUtils.forEach(arrayOfRules, function (ruleName) {
                var rule = rules.get(ruleName);

                if (!rule.check(value)) {
                    errors.push(rule.instruction);
                }
            });

            return errors.isEmpty();
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.fn = GRA.fn || {};

    /**
     *
     * @constructor
     */
    GRA.fn.ExecutionQueue = function ExecutionQueue() {
        var tasks = new GRA.datastructure.Queue(),
            parameters = [];

        /**
         * Permet d'ajouter une tâche à la file d'exécution
         *
         * @param {function} task Tâche (fonction)
         */
        this.add = function add(task) {
            tasks.enqueue(task);
        };

        /**
         * Permet de d'exécuter la file d'exécution
         *
         * @param {function} callback Fonction à exécuter à la fin des tâches
         */
        this.run = function run(callback) {
            var queue = tasks.clone();

            setTimeout(function execution() {
                var task = queue.dequeue();
                task.apply(null, parameters);

                if (0 < queue.size()) {
                    setTimeout(execution, 5);  //arguments.callee
                } else {
                    callback();
                }
            }, 5);
        };

        /**
         * Permet de spécifier la liste des paramètres à passer à chaque tâche
         *
         * @param {Array} params Liste des paramètres
         */
        this.setParameters = function setParameters(params) {
            parameters = params;
        };

        /**
         * Permet d'ajouter une liste de tâches à la file d'exécution
         *
         * @param {Array} arrayOfTasks Liste des tâches (fonctions)
         */
        this.setTasks = function setTasks(arrayOfTasks) {
            var index,
                length = arrayOfTasks.length;

            for (index = 0; index < length; index += 1) {
                tasks.enqueue(arrayOfTasks[index]);
            }
        };
    };
    
}(GRA || {}));(function (GRA) {
    "use strict";

    // Initialisation des namespaces
    GRA.fn = GRA.fn || {};

    /**
     * @type {number}
     */
    GRA.fn.CLOCK_MILLISECOND = 1;

    /**
     * @type {number}
     */
    GRA.fn.CLOCK_SECOND = 1000;

    /**
     * Classe Manager
     * Gestionnaire des fonctions
     *
     * @constructor
     */
    GRA.fn.Manager = function Manager() {
        /**
         * @type {number}
         */
        var anonymousLength = 0,
            /**
             * @type {GRA.datastructure.Map}
             */
            callbacks = new GRA.datastructure.Map(),
            /**
             * @type {string}
             */
            timeUnit = GRA.fn.CLOCK_SECOND;

        
        /**
         * Permet de savoir si la fonction dont le nom/identifiant est passé en paramètre est gérée
         *
         * @param {string} callbackName Nom/Identifiant de la fonction
         * @returns {boolean} TRUE si la fonction est gérée, FALSE sinon
         */
        this.has = function has(callbackName) {
            return callbacks.containsKey(callbackName);
        };

        /**
         * Permet de savoir si la fonction est en cours d'exécution
         *
         * @param {string} callbackName Nom/Identifiant de la fonction
         * @returns {boolean} TRUE si la fonction est en cours d'exécution, FALSE sinon
         */
        this.isRunning = function isRunning(callbackName) {
            var running = false;

            if (this.has(callbackName)) {
                running = callbacks.get(callbackName).isRunning;
            }

            return running;
        };

        /**
         * Permet d'enregistrer la fonction passée en paramètre dans le gestionnaire
         *
         * @param {function} callback Fonction à enregistrer et gérer
         */
        this.register = function register(callback) {
            var callbackName = "anonymous" + anonymousLength;

            if (GRA.utils.ObjectUtils.isAnonymous(callback)) {
                anonymousLength += 1;
            } else {
                callbackName = GRA.utils.ObjectUtils.getFunctionName(callback);
            }

            callbacks.put(callbackName, {
                callback: callback,
                isRunning: false,
                processId: null
            });
        };

        /**
         * Permet d'exécuter la fonction dont le nom est passé en paramètre.
         *
         * @param {string} callbackName Nom de la fonction à exécuter
         * @param {object} [namespace] Espace de nom où se situe la fonction
         */
        this.run = function run(callbackName, namespace) {
            var callback;

            if (namespace && namespace.hasOwnProperty(callbackName)) {
                namespace[callbackName]();
            } else if (this.has(callbackName)) {
                callback = callbacks.get(callbackName);
                callback.callback();
            } else if (window[callbackName]) {
                window[callbackName]();
            }
        };

        /**
         * Permet d'exécuter une fonction après un certain délai
         *
         * @param {number} delay Délai
         * @param {string|function} callbackName Nom de la fonction à exécuter ou fonction à exécuter
         */
        this.runAfter = function runAfter(delay, callbackName) {
            var callbackInfo;

            if (GRA.utils.is.callable(callbackName)) {
                setTimeout(callbackName, delay * timeUnit);
            } else if (this.has(callbackName)) {
                callbackInfo = callbacks.get(callbackName);

                callbackInfo.processId = setTimeout(function process() {
                    callbackInfo.isRunning = true;
                    callbackInfo.callback();
                    callbackInfo.isRunning = false;
                }, delay * timeUnit);
            }
        };

        /**
         * Permet d'exécuter une fonction de manière asynchrone
         *
         * @param {function} callback Fonction à exécuter
         */
        this.runAsync = function runAsync(callback) {
            var callbackInfo;

            if (GRA.utils.is.callable(callback)) {
                setTimeout(callback, 5);
            } else if (this.has(callback)) {
                callbackInfo = callbacks.get(callback);
                setTimeout(callbackInfo.callback, 5);
            }
        };

        /**
         * Permet d'exécuter une fonction après chaque délai écoulé
         *
         * @param {number} delay Délai
         * @param {string} callbackName Fonction à exécuter
         */
        this.runEvery = function runEvery(delay, callbackName) {
            var callbackInfo;

            if (this.has(callbackName)) {
                callbackInfo = callbacks.get(callbackName);
                callbackInfo.processId = setInterval(callbackInfo.callback, delay * timeUnit);
                callbackInfo.isRunning = true;
            }
        };

        /**
         * Permet d'exécuter une fonction seulement lorsque le DOM est prêt
         *
         * @param {function} callback Fonction à exécuter
         */
        this.runWhenReady = function runWhenReady(callback) {
            var toRun = callback;

            if (GRA.utils.is.string(callback) && this.has(callback)) {
                toRun = callbacks.get(callback).callback;
            }

            if ('loading' != document.readyState) {
                toRun();
            } else {
                document.addEventListener('DOMContentLoaded', toRun);
            }
        };

        /**
         * Permet de définir l'unité de temps
         *
         * @param {Number} unit Unité de temps
         */
        this.setTimeUnit = function setTimeUnit(unit) {
            if (unit === GRA.fn.CLOCK_SECOND || unit === GRA.fn.CLOCK_MILLISECOND) {
                timeUnit = unit;
            }
        };

        /**
         * Permet de retourner le nombre total de fonctions gérées
         *
         * @returns {number} Nombre total de fonctions gérées
         */
        this.size = function size() {
            return callbacks.size();
        };

        /**
         * Permet de stopper l'exécution d'une fonction
         *
         * @param {string} callbackName Nom de la fonction
         * @returns {boolean} TRUE si la fonction a été stoppée, FALSE sinon
         */
        this.stop = function stop(callbackName) {
            var hasBeenStopped = false,
                callbackInfo;

            if (this.has(callbackName)) {
                callbackInfo = callbacks.get(callbackName);

                if (null !== callbackInfo.processId) {
                    clearInterval(callbackInfo.processId);
                    callbackInfo.isRunning = false;
                }

                hasBeenStopped = true;
            }

            return hasBeenStopped;
        };

        /**
         * Permet de désenregistrer une fonction
         *
         * @param {string} callbackName Nom de la fonction
         * @returns {boolean} TRUE si la fonction a été désenregistré, FALSE sinon
         */
        this.unregister = function unregister(callbackName) {
            var hasBeenUnregistered = false;

            if (this.stop(callbackName)) {
                hasBeenUnregistered = callbacks.remove(callbackName);
            }

            return hasBeenUnregistered;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.fn = GRA.fn || {};

    /**
     * @type {object}
     */
    GRA.fn.PromiseState = {
        PENDING: 0,
        RESOLVED: 1,
        REJECTED: -1
    };

    /**
     * Classe Promise
     *
     * @param {function} fn
     * @constructor
     */
    GRA.fn.Promise = function Promise(fn) {
        var state = GRA.fn.PromiseState.PENDING,
            value,
            deferred,
            handle = function handle(handler) {
                var returnValue,
                    handlerCallback;

                if (state === GRA.fn.PromiseState.PENDING) {
                    deferred = handler;
                } else {
                    setTimeout(function () {
                        if (state === GRA.fn.PromiseState.RESOLVED) {
                            handlerCallback = handler.onResolved;
                        } else {
                            handlerCallback = handler.onRejected;
                        }

                        if (handlerCallback) {
                            try {
                                returnValue = handlerCallback(value);
                                handler.resolve(returnValue);
                            } catch (e) {
                                handler.reject(e);
                            }
                        } else if (state === GRA.fn.PromiseState.RESOLVED) {
                            handler.resolve(value);
                        } else {
                            handler.reject(value);
                        }
                    }, 5);
                }
            },
            reject = function reject(reason) {
                state = GRA.fn.PromiseState.REJECTED;
                value = reason;

                if (deferred) {
                    handle(deferred);
                }
            },
            resolve = function resolve(newValue) {
                try {
                    if (newValue instanceof GRA.fn.Promise) {
                        newValue.then(resolve);
                    } else {
                        value = newValue;
                        state = GRA.fn.PromiseState.RESOLVED;

                        if (deferred) {
                            handle(deferred);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            };

        /**
         *
         * @param onError
         */
        this.onError = function onError(onError) {
            setTimeout(function () {
                handle({
                    onResolved: null,
                    onRejected: onError
                });
            }, 5);
        };

        /**
         *
         * @param onResolved
         * @param onRejected
         */
        this.done = function done(onResolved, onRejected) {
            setTimeout(function () {
                handle({
                    onResolved: onResolved,
                    onRejected: onRejected
                });
            }, 5);
        };

        /**
         *
         *
         * @param {function} onFailure
         * @returns {GRA.fn.Promise}
         */
        this.fail = function fail(onFailure) {
            return new GRA.fn.Promise(function (resolve, reject) {
                handle({
                    onResolved: null,
                    onRejected: onFailure,
                    resolve: resolve,
                    reject: reject
                });
            });
        };

        /**
         *
         * @returns {number}
         */
        this.getState = function getState() {
            return state;
        };

        /**
         *
         * @param onResolved
         * @param onRejected
         * @returns {GRA.fn.Promise}
         */
        this.then = function then(onResolved, onRejected) {
            return new GRA.fn.Promise(function (resolve, reject) {
                handle({
                    onResolved: onResolved,
                    onRejected: onRejected,
                    resolve: resolve,
                    reject: reject
                });
            });
        };

        /**
         *
         * @returns {*}
         */
        this.val = function val() {
            return value;
        };

        fn(resolve, reject);
    };

}(GRA || {}));(function (GRA) {
    "use strict";

    GRA.kernel = GRA.kernel || {};

    /**
     * Classe Application
     *
     * @param {string} appName Nom de l'application
     * @constructor
     */
    GRA.kernel.Application = function Application(appName) {
        /**
         * @type {string}
         */
        var name = appName,
            /**
             * @type {object}
             */
            api,
            /**
             * @type {GRA.kernel.Bus}
             */
            bus,
            /**
             * @type {object}
             */
            events = Object.create(null);

            /**
             * Permet d'envoyer un Message à toutes les autres applications
             *
             * @param {Message} message Message à envoyer à toutes les autres applications
             */
            this.broadcast = function broadcast(message) {
                bus.notifyAll(message);
            };

            /**
             * Permet de créer un message
             *
             * @param {Number} requestCode Code de la requête
             * @param {String} description Description du message
             * @returns {GRA.kernel.Message} Instance de Message
             */
            this.createMessage = function createMessage(requestCode, description) {
                return new GRA.kernel.Message(requestCode, description || '');
            };

            /**
             *
             * @param {string} event
             * @param {*} param
             */
            this.dispatch = function dispatch(event, param) {
                if (GRA.utils.ObjectUtils.own(event, events)) {
                    events[event](param);
                }
            };

            /**
             *
             * @param componentName
             * @returns {*}
             */
            this.get = function get(componentName) {
                return api.get(componentName);
            };

            /**
             * Permet de retourner le nom de l'application
             *
             * @returns {string} Nom de l'application
             */
            this.getName = function getName() {
                return name;
            };

            /**
             * Permet de signaler au Kernel d'afficher une information à l'utilisateur
             *
             * @param {string} msg Message à afficher à l'utilisateur
             * @param {string} level Niveau de l'information ['info' ou 'success']
             */
            this.notifyUser = function notifyUser(msg, level) {
                GRA.kernel.Kernel.notify(msg, level);
            };

            /**
             * Permet d'initialiser l'application
             *
             * @param {GRA.kernel.Bus} kernelBus Bus du noyau
             * @param {object} kernelApi API du noyau
             */
            this.init = function init(kernelBus, kernelApi) {
                bus = kernelBus;
                api = kernelApi;

                bus.subscribe(this);
            };

            /**
             *
             * @param event
             * @param callback
             */
            this.on = function on(event, callback) {
                events[event] = callback;
            };

            /**
             * Permet de lever une erreur au noyau
             *
             * @param {string} msg Message d'erreur à lever
             */
            this.raiseError = function raiseError(msg) {
                GRA.kernel.Kernel.raiseError(msg);
            };

            /**
             * Evénement lancé lorsque l'application reçoie un Message du Bus
             *
             * @param {Message} message Message reçu
             */
            this.receive = function receive(message) {
                this.dispatch('message', message);
            };

            /**
             * Permet à l'application d'envoyer un Message à une autre application
             *
             * @param {string} application Application destinataire
             * @param {Message} message Message à envoyer
             */
            this.sendTo = function sendTo(application, message) {
                bus.notify(application, message);
            };

            this.uid = GRA.utils.TokenUtils.generate(5, 10);

            /**
             * Permet d'informer le noyau d'afficher un avertissement à l'utilisateur
             *
             * @param {string} msg Avertissement à afficher à l'utilisateur
             */
            this.warnUser = function warnUser(msg) {
                GRA.kernel.Kernel.warn(msg);
            };
    };

}(GRA || {}));(function (GRA) {
    "use strict";

    GRA.kernel = GRA.kernel || {};

    /**
     * Classe Bus
     * Permet l'échange d'information (de Message) entre les applications
     *
     * @constructor
     */
    GRA.kernel.Bus = function Bus() {
        /**
         * @type {object}
         */
        var subscribers = {},
            /**
             * @type {number}
             */
            subscribersLength = 0;

        /**
         * Permet d'envoyer un message à l'application dont le nom est fourni en paramètre
         *
         * @param {string} applicationId Identifiant de l'application
         * @param {GRA.kernel.Message} message Message à envoyer
         */
        this.notify = function notify(applicationId, message) {
            if (subscribers.hasOwnProperty(applicationId)) {
                subscribers[applicationId].receive(message);
            }
        };

        /**
         * Permet d'envoyer un Message à toutes les applications
         *
         * @param {GRA.kernel.Message} message Message à envoyer
         */
        this.notifyAll = function notifyAll(message) {
            var subscriberId;

            for (subscriberId in subscribers) {
                if (subscribers.hasOwnProperty(subscriberId)) {
                    subscribers[subscriberId].receive(message);
                }
            }
        };

        /**
         * Permet de retourner la taille du Bus (nombre d'applications enregistrées)
         *
         * @returns {number} La taille du Bus
         */
        this.size = function size() {
            return subscribersLength;
        };

        /**
         * Permet d'enregistrer une application dans le Bus
         *
         * @param {GRA.kernel.Application} application Application à enregistrer
         */
        this.subscribe = function subscribe(application) {
            subscribers[application.getName()] = application;
            subscribersLength += 1;
        };

        /**
         * Permet d'enlever une application du Bus
         *
         * @param {string} applicationId Identifiant de l'application
         */
        this.unsubscribe = function unsubscribe(applicationId) {
            delete subscribers[applicationId];
            subscribersLength -= 1;
        };
    };

}(GRA || {}));(function (GRA) {
    "use strict";

    var internalApi,
        internalLogger;

    // Initialisation des namespaces
    GRA.kernel = GRA.kernel || {};

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "6000",
        "extendedTimeOut": "1200",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    /**
     * Classe KernelApi
     *
     * @class
     */
    internalApi = (function KernelApi() {
        var api = Object.create(null);

        return {
            /**
             *
             * @param componentName
             */
            conceal: function conceal(componentName) {
                if (this.has(componentName)) {
                    delete api[componentName];
                }
            },
            /**
             *
             * @param componentName
             * @returns {*}
             */
            get: function get(componentName) {
                if (!this.has(componentName)) {
                    throw new Error("");
                }

                return api[componentName];
            },
            /**
             *
             * @param componentName
             * @returns {*|boolean}
             */
            has: function has(componentName) {
                return GRA.utils.ObjectUtils.own(componentName, api);
            },
            /**
             *
             * @param componentName
             * @param component
             */
            provide: function use(componentName, component) {
                api[componentName] = component;
            }
        };
    }());

    /**
     * @class
     */
    internalLogger = (function Logger() {

        var debug,
            isLoggable = function isLoggable() {
                return debug && window.console;
            },
            nowAsString = function nowAsString() {
                var today = new Date();

                return today.toLocaleString();
            };

        return {
            disable: function disable() {
                debug = false;
            },
            enable: function enable() {
                debug = true;
            },
            error: function error(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();

                    if (message instanceof Error) {
                        window.console.error('[ERROR ' + message.fileName + '] ' + today + ', ligne ' + message.lineNumber + ' : ' + message.message);
                    } else {
                        window.console.error('[ERROR] ' + today +  ' : ' + message);
                    }
                }
            },
            info: function info(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.info('[INFO] ' + today +  ' : ' + message);
                }
            },
            log: function log(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.log('[LOG] ' + today + ' : ' + message);
                }
            },
            warning: function warning(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.info('[WARNING] ' + today +  ' : ' + message);
                }
            }
        };
    }());


    /**
     * Classe Kernel
     *
     * @constructor
     */
    GRA.kernel.Kernel = function Kernel() {
        /**
         * @type {boolean}
         */
        var debug,
            /**
             * @type {object}
             */
            applications = Object.create(null),
            /**
             * @type {GRA.kernel.Bus}
             */
            bus = new GRA.kernel.Bus(),
            isBootable = function isBootable(application) {
                return application instanceof GRA.kernel.Application;
            };

        // Initialisation de l'API
        internalApi.provide('logger', internalLogger);

        /**
         * Permet d'accéder l'API du noyau
         *
         * @returns {object}
         */
        this.api = function api() {
            return internalApi;
        };

        /**
         * Permet d'enregistrer une application dans le noyau
         *
         * @param {function} application Application à booter
         */
        this.boot = function boot(application) {
            var app = application(),
                name;

            if (isBootable(app)) {
                name = app.getName();
                internalLogger.info("Enregistrement de l'application [" + name + "]");

                app.init(bus, internalApi);

                applications[name] = {
                    instance: app,
                    started: false
                };

                try {
                    app.dispatch('boot');
                } catch (e) {
                    internalLogger.error(e);
                    toastr.error(e.message, "Erreur survenue");
                }
            }
        };

        /**
         * Permet de retirer un composant de l'API
         *
         * @param {string} componentName
         */
        this.conceal = function conceal(componentName) {
            internalApi.conceal(componentName);
        };

        /**
         * Permet de créer une application
         *
         * @param {string} applicationName Nom de l'application à créer
         * @returns {GRA.kernel.Application} L'Application créée
         */
        this.createApplication = function createApplication(applicationName) {
            return new GRA.kernel.Application(applicationName);
        };

        /**
         * Permet de créer un composant à partir de son nom.
         *
         * @param {String} componentName Nom du composant
         * @returns {*}
         */
        this.createComponent = function createComponent(componentName) {
            var component,
                realComponentName,
                stringUtils = GRA.utils.StringUtils;

            if (GRA.component.hasOwnProperty(componentName)) {
                component = new GRA.component[componentName]();
                component.create();
            } else if (stringUtils.has('-', componentName)) {
                realComponentName = componentName.replace(/\-/g, ' ');
                realComponentName = stringUtils.ucfirstAll(realComponentName);
                realComponentName = realComponentName.replace(/\s/g, '');

                if (GRA.component.hasOwnProperty(realComponentName)) {
                    component = new GRA.component[realComponentName]();
                    component.create();
                }
            }

            return component;
        };

        /**
         * Permet de savoir si une application est attachée ou non au noyau
         *
         * @param {string} applicationId Nom de l'application
         * @returns {boolean} TRUE si l'application est attachée au noyau, FALSE sinon
         */
        this.isBooted = function isBooted(applicationId) {
            return GRA.utils.ObjectUtils.own(applicationId, applications);
        };

        /**
         * Permet de savoir si le noyau est en mode DEBUG ou non
         *
         * @returns {boolean} Mode du noyau
         */
        this.isDebug = function isDebug() {
            return !!debug;
        };

        /**
         * Permet de savoir si une application est démarrée
         *
         * @param {string} applicationId Nom de l'application
         * @returns {boolean} TRUE si l'application est démarrée, FALSE sinon
         */
        this.isStarted = function isStarted(applicationId) {
            var started = false;

            if (this.isBooted(applicationId)) {
                started = applications[applicationId].started;
            }

            return started;
        };

        /**
         * Permet de notifier un message à l'utilisateur
         *
         * @param {string} msg Message à notifier à l'utilisateur
         * @param {string} level Niveau du message
         */
        this.notify = function notify(msg, level) {
            if ('success' === level) {
                toastr.success(msg, "Information");
            } else {
                toastr.info(msg, "Information");
            }
        };

        /**
         * Permet d'ajouter un composant à l'API
         *
         * @param {string} componentName Nom du composant
         * @param {*} component Composant à ajouter à l'API
         */
        this.provide = function provide(componentName, component) {
            internalApi.provide(componentName, component);
        };

        /**
         * Permet de lever une erreur à l'utilisateur
         *
         * @param {string} msg Message d'erreur à afficher
         */
        this.raiseError = function raiseError(msg) {
            toastr.error(msg, "Erreur survenue");
        };

        /**
         * Permet de définir si le noyau doit être en mode DEBUG
         *
         * @param {boolean} debugMode Si debug ou non
         */
        this.setDebug = function setDebug(debugMode) {
            debug = !!debugMode;

            internalLogger.disable();
            if (debug) {
                internalLogger.enable();
            }
        };

        /**
         * Permet de démarrer une application
         *
         * @param {string} applicationId Nom de l'application à démarrer
         */
        this.start = function start(applicationId) {
            var fnManager;

            if (!this.isStarted(applicationId)) {
                fnManager = new GRA.fn.Manager();
                fnManager.runWhenReady(function startFunction() {
                    applications[applicationId].started = true;
                    internalLogger.info("L'application [" + applicationId + "] a été démarrée.");

                    try {
                        applications[applicationId].instance.dispatch('start');
                    } catch (e) {
                        internalLogger.error(e);
                        toastr.error(e.message, "Erreur survenue");
                    }

                });
            }
        };

        /**
         * Permet de démarrer toutes les applications
         */
        this.startAll = function startAll() {
            var application;

            for (application in applications) {
                this.start(application);
            }
        };

        /**
         * Permet de stopper une application
         *
         * @param {string} applicationId Nom de l'application à stopper
         */
        this.stop = function stop(applicationId) {
            if (this.isStarted(applicationId)) {
                applications[applicationId].started = false;
                try {
                    applications[applicationId].instance.dispatch('stop');
                } catch (e) {
                    internalLogger.error(e);
                    toastr.error(e.message, "Erreur survenue");
                }
            }
        };

        /**
         * Permet de stopper toutes les applications
         */
        this.stopAll = function stopAll() {
            var application;

            for (application in applications) {
                this.stop(application);
            }
        };

        /**
         * @type {object}
         */
        this.urls = Object.create(null);

        /**
         * Permet d'avertir l'utilisateur
         *
         * @param {string} msg Message d'avertissement à afficher
         */
        this.warn = function warn(msg) {
            toastr.warning(msg, "Attention");
        };
    };

    GRA.kernel.Kernel = new GRA.kernel.Kernel();
}(GRA || {}));(function (GRA) {
    "use strict";

    GRA.kernel = GRA.kernel || {};

    /**
     * Classe Message
     * Permet la communication entre les applications.
     *
     * @constructor
     */
    GRA.kernel.Message = function Message(requestCode, messageDescription) {
        /**
         * @type {number}
         */
        var id = +new Date(),

            /**
             * @type {int}
             */
            request = requestCode,

            /**
             * @type {string}
             */
            description = messageDescription || '',

            /**
             * @type {object}
             */
            integers = {},

            /**
             * @type {object}
             */
            strings = {},

            /**
             * @type {object}
             */
            objects = {};

        /**
         * Retourne l'identifiant du message
         *
         * @returns {number}
         */
        this.getId = function getId() {
            return id;
        };

        /**
         * Retourne le code de requête du message
         *
         * @returns {number}
         */
        this.getRequestCode = function getRequestCode() {
            return request;
        };

        /**
         * Retourne la description du message
         *
         * @returns {string}
         */
        this.getDescription = function getDescription() {
            return description;
        };

        /**
         * Retourne l'entier dont la clé est fournie en paramètre.
         * Si la clé n'est pas trouvée, la valeur par défaut est retournée.
         *
         * @param {string} key Clé sous laquelle est contenue l'entier
         * @param {number} defaultValue Valeur par défaut à retourner si la clé est introuvable
         * @returns {number} L'entier
         */
        this.getInt = function getInt(key, defaultValue) {
            var value = defaultValue;

            if (integers.hasOwnProperty(key)) {
                value = integers[key];
            }
            return value;
        };

        /**
         * Retourne la chaîne de caractères dont la clé est fournie en paramètre.
         * Si la clé n'est pas trouvée, la valeur par défaut est retournée.
         *
         * @param {string} key Clé sous laquelle est contenue la chaîne de caractères
         * @param {string} defaultValue Valeur par défaut à retourner si la clé est introuvable
         * @returns {string} La chaîne de caractères
         */
        this.getString = function getString(key, defaultValue) {
            return strings[key] || defaultValue;
        };

        /**
         * Retourne l'objet dont la clé est fournie en paramètre.
         * Si la clé n'est pas trouvée, la valeur par défaut est retournée.
         *
         * @param {string} key Clé sous laquelle est contenue l'objet
         * @param {object} defaultValue Valeur par défaut à retourner si la clé est introuvable
         * @returns {object} L'objet
         */
        this.getObject = function getObject(key, defaultValue) {
            return objects[key] || defaultValue;
        };

        /**
         * Permet de stocker un entier dans le Message
         *
         * @param {string} key Clé sous laquelle sera contenue l'entier
         * @param {number} value L'entier à stocker
         */
        this.putInt = function putInt(key, value) {
            integers[key] = value;
        };

        /**
         * Permet de stocker une chaîne de caractères dans le Message
         *
         * @param {string} key Clé sous laquelle sera contenue la chaîne de caractères
         * @param {string} value La chaîne de caractères à stocker
         */
        this.putString = function putString(key, value) {
            strings[key] = value;
        };

        /**
         * Permet de stocker un objet dans le Message
         *
         * @param {string} key Clé sous laquelle sera contenue l'objet
         * @param {object} value L'objet à stocker
         */
        this.putObject = function putObject(key, value) {
            objects[key] = value;
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.model = GRA.model || {};

    /**
     * Classe Model
     * Représente un Model (Data)
     *
     * @param {string} modelName Nom du Modèle
     * @constructor
     */
    GRA.model.Model = function Model(modelName) {
        var name = modelName.toLowerCase(),
            attr,
            relatedForm,
            getSource = function getSource(method, url) {
                var kernel = GRA.kernel.Kernel,
                    source;

                if (kernel.urls.hasOwnProperty(name) && kernel.urls[name].hasOwnProperty(method)) {
                    source = kernel.urls[name][method];
                } else if (url) {
                    source = url;
                } else {
                    throw new Error("Aucune URL source pour GRA.model.Model::" + method + "()");
                }

                return source;
            },
            dispatchFormEvent = function dispatchFormEvent(property) {
                if (relatedForm) {
                    relatedForm.dispatch('model.attribute.update', [property]);
                }
            },
            events = {};
        
        /**
         *
         * @param form
         */
        this.attachTo = function attachTo(form) {
            form.setModel(this);
            relatedForm = form;
        };

        /**
         *
         * @param attribute
         * @param attributeValue
         * @returns {*}
         */
        this.attribute = function attribute(attribute, attributeValue) {
            var value;

            if (attr.hasOwnProperty(attribute)) {
                value = attr[attribute];
            }

            if (attributeValue !== undefined) {
                attr[attribute] = attributeValue;
                value = this;
            }

            return value;
        };

        /**
         *
         */
        this.clear = function clear() {
            GRA.storage.local.remove('model/' + name);
        };

        /**
         *
         * @param attributes
         */
        this.defineBy = function defineBy(attributes) {
            attr = attributes;
        };

        /**
         *
         * @param eventName
         * @param params
         */
        this.dispatch = function dispatch(eventName, params) {
            if (events.hasOwnProperty(eventName)) {
                events[eventName](params);
            }
        };

        /**
         *
         * @param modelId
         * @param url
         */
        this.find = function find(modelId, url) {
            var source = getSource('find', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.get(source, function (data) {
                GRA.utils.ObjectUtils.forEachProperties(attr, function (property) {
                    model.attr(property, data[property]);

                    dispatchFormEvent(property);
                });
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getName = function getName() {
            return name;
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            events[eventName] = callback;
        };

        /**
         *
         * @param timeToLive
         */
        this.persist = function persist(timeToLive) {
            var modelToObject = this.toObject();

            GRA.storage.local.set('model/' + name, modelToObject, timeToLive);
        };

        /**
         *
         * @param url
         */
        this.remove = function remove(url) {
            var source = getSource('remove', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.delete(source, function () {
                model.dispatch('remove');
            });
        };

        /**
         *
         */
        this.retrieve = function retrieve() {
            var model = GRA.storage.local.get('model/' + name),
                current = this;

            if (model) {
                GRA.utils.ObjectUtils.forEachProperties(attr, function (property) {
                    current.attribute(property, model.attributes[property]);

                    dispatchFormEvent(property);
                });
            }
        };

        /**
         *
         * @param url
         */
        this.save = function save(url) {
            var source = getSource('save', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.post(source, function () {
                model.dispatch('save');
            });
        };

        /**
         *
         * @returns {{name: string, attributes: *}}
         */
        this.toObject = function toObject() {
            return {
                name: name,
                attributes: attr
            };
        };

        /**
         * 
         * @returns {*|string}
         */
        this.toString = function toString() {
            return GRA.utils.ObjectUtils.stringify({
                name: name,
                attributes: attr
            });
        };
    };

}(GRA || {}));(function (GRA) {

    GRA.storage = GRA.storage || {};

    /**
     * Classe LocalStorage
     * Permet de manipuler le stockage local du navigateur
     *
     * @constructor
     */
    GRA.storage.local = function LocalStorage() {

        var isExpired = function isExpired(date, ttl) {
                var now = +new Date();

                return ttl && ((now - date) > (ttl * 10 * 10 * 10));
            },
            setTtl = function setTtl(value, ttl) {
                return GRA.utils.ObjectUtils.stringify({
                    item: value,
                    date: (+new Date()),
                    ttl: ttl
                });
            },
            toStr = function toStr(value) {
                var valueToStr = value;

                if (!GRA.utils.is.string(value)) {
                    valueToStr = GRA.utils.ObjectUtils.stringify(value);
                }

                return valueToStr;
            };

        /**
         *
         */
        this.clear = function clear() {
            localStorage.clear();
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return 0 === localStorage.length;
        };

        /**
         *
         * @param key
         * @param defaultValue
         * @returns {*}
         */
        this.get = function get(key, defaultValue) {
            var object,
                item = defaultValue;

            if (this.has(key)) {
                object = localStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    localStorage.removeItem(key);
                } else {
                    try {
                        item = GRA.utils.ObjectUtils.parseJSON(object.item);
                    } catch (e) {
                        item = object.item;
                    }
                }
            }

            return item;
        };

        /**
         *
         * @param key
         * @returns {boolean}
         */
        this.has = function has(key) {
            return localStorage.hasOwnProperty(key);
        };

        /**
         *
         */
        this.refresh = function refresh() {
            var index,
                storageSize = localStorage.length,
                key,
                object;

            for (index = 0; index < storageSize; index += 1) {
                key = localStorage.key(index);
                object = localStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    localStorage.removeItem(key);
                }
            }
        };

        /**
         *
         * @param key
         */
        this.remove = function remove(key) {
            localStorage.removeItem(key);
        };

        /**
         *
         * @param key
         * @param value
         * @param timeToLive
         */
        this.set = function set(key, value, timeToLive) {
            var valueToStr = toStr(value),
                ttl = timeToLive || null,
                objectToStore = setTtl(valueToStr, ttl);

            localStorage.setItem(key, objectToStore);
        };
    };

    GRA.storage.local = new GRA.storage.local();

}(GRA || {}));(function (GRA) {

    GRA.storage = GRA.storage || {};

    /**
     * Classe SessionStorage
     * Permet de manipuler le stockage en session du navigateur
     *
     * @constructor
     */
    GRA.storage.session = function SessionStorage() {

        var isExpired = function isExpired(date, ttl) {
                var now = +new Date();

                return ttl && ((now - date) > (ttl * 10 * 10 * 10));
            },
            setTtl = function setTtl(value, ttl) {
                return GRA.utils.ObjectUtils.stringify({
                    item: value,
                    date: (+new Date()),
                    ttl: ttl
                });
            },
            toStr = function toStr(value) {
                var valueToStr = value;

                if (!GRA.utils.is.string(value)) {
                    valueToStr = GRA.utils.ObjectUtils.stringify(value);
                }

                return valueToStr;
            };

        /**
         *
         */
        this.clear = function clear() {
            sessionStorage.clear();
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return 0 === sessionStorage.length;
        };

        /**
         *
         * @param key
         * @param defaultValue
         * @returns {*}
         */
        this.get = function get(key, defaultValue) {
            var object,
                item = defaultValue;

            if (this.has(key)) {
                object = sessionStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    sessionStorage.removeItem(key);
                } else {
                    try {
                        item = GRA.utils.ObjectUtils.parseJSON(object.item);
                    } catch (e) {
                        item = object.item;
                    }
                }
            }

            return item;
        };

        /**
         *
         * @param key
         * @returns {boolean}
         */
        this.has = function has(key) {
            return sessionStorage.hasOwnProperty(key);
        };

        /**
         *
         */
        this.refresh = function refresh() {
            var index,
                storageSize = sessionStorage.length,
                key,
                object;

            for (index = 0; index < storageSize; index += 1) {
                key = sessionStorage.key(index);
                object = sessionStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    sessionStorage.removeItem(key);
                }
            }
        };

        /**
         *
         * @param key
         */
        this.remove = function remove(key) {
            sessionStorage.removeItem(key);
        };

        /**
         *
         * @param key
         * @param value
         * @param timeToLive
         */
        this.set = function set(key, value, timeToLive) {
            var valueToStr = toStr(value),
                ttl = timeToLive || null,
                objectToStore = setTtl(valueToStr, ttl);

            sessionStorage.setItem(key, objectToStore);
        };
    };

    GRA.storage.session = new GRA.storage.session();

}(GRA || {}));(function (GRA) {
    "use strict";

    GRA.utils = GRA.utils || {};

    /**
     * Classe ArrayUtils
     *
     * @constructor
     */
    GRA.utils.ArrayUtils = function ArrayUtils() {
        /**
         * Permet de vider un tableau
         *
         * @param {Array} array Tableau à vider
         */
        this.clear = function clear(array) {
            while (0 < array.length) {
                array.pop();
            }
        };

        /**
         * Permet de concaténer les éléments du tableau un à un.
         *
         * @param array Tableau
         * @param delimiter Délimiteur à concaténer entre les chaînes (optionnel)
         * @returns {string} Concaténation des élements du tableau
         */
        this.concat = function concat(array, delimiter) {
            return array.join(delimiter);
        };

        /**
         * Permet d'exécuter une fonction sur chaque élément d'un tableau
         *
         * @param array Tableau
         * @param callback Fonction à appeler sur chaque élément du tableau
         */
        this.forEach = function forEach(array, callback) {
            var index,
                arrayLength = array.length;
            
            for (index = 0; index < arrayLength; index += 1) {
                callback(array[index], index);
            }
        };

        /**
         * Retourne l'indice de la variable dans le tableau.
         *
         * @param variable Variable à rechercher
         * @param array Tableau à scanner
         * @returns {number} L'indice de la variable dans le tableau, -1 si la variable n'est pas dans le tableau
         */
        this.indexOf = function indexOf(variable, array) {
            var index = 0,
                arrayLength = array.length >>> 0,
                elementIndex = -1,
                elementFound = false;

            if (0 === arrayLength) {
                elementFound = true;
            }

            while (index < arrayLength && !elementFound) {
                if (array[index] === variable) {
                    elementIndex = index;
                    elementFound = true;
                }

                index += 1;
            }

            return elementIndex;
        };

        /**
         * Permet de savoir si une variable est contenue dans le tableau.
         *
         * @param variable Variable à rechercher
         * @param array Tableau à scanner
         * @returns {boolean} TRUE si la variable est dans le tableau, FALSE sinon
         */
        this.inArray = function inArray(variable, array) {
            return -1 !== this.indexOf(variable, array);
        };

        /**
         * Permet d'appliquer une fonction sur chaque élément du tableau, en partant de la fin.
         *
         * @param array Tableau à parcourir
         * @param callback Fonction à exécuter
         */
        this.reverseForEach = function reverseForEach(array, callback) {
            var i;

            for (i = array.length - 1; 0 <= i; i -= 1) {
                callback(array[i], i);
            }
        };

        /**
         * Permet de retourner la somme de tous les éléments du tableau.
         * Chaque élement sera converti en entier.
         *
         * @param arrayOfNumbers Tableau
         * @returns {number} La somme des éléments du tableau
         */
        this.sum = function sum(arrayOfNumbers) {
            var index,
                arrayLength = arrayOfNumbers.length,
                sum = 0;

            for (index = 0; index < arrayLength; index += 1) {
                sum += parseInt(arrayOfNumbers[index], 10);
            }

            return sum;
        };
    };

    GRA.utils.ArrayUtils = new GRA.utils.ArrayUtils();

}(GRA || {}));(function (GRA) {
    "use strict";

    GRA.utils = GRA.utils || {};

    /**
     * Classe DateUtils
     * Utilitaire permettant de manipuler facilement les dates
     *
     * @constructor
     */
    GRA.utils.DateUtils = function DateUtils() {

        /**
         *
         * @param {Date} date
         * @param {object} property
         * @param {number} value
         * @returns {Date}
         */
        this.add = function add(date, property, value) {
            var getter = 'get' + GRA.utils.StringUtils.ucfirst(property),
                setter = 'set' + GRA.utils.StringUtils.ucfirst(property),
                currentValue;

            if (date.hasOwnProperty(setter)) {
                currentValue = date[getter]();
                date[setter](currentValue + value);
            } else {
                switch (property) {
                    case 'days':
                        currentValue = date.getDate();
                        date.setDate(currentValue + value);
                        break;
                    case 'years':
                        currentValue = date.getFullYear();
                        date.setFullYear(currentValue + value);
                        break;
                    case 'weeks':
                        currentValue = date.getDate();
                        date.setDate(currentValue + (value * 7));
                        break;
                    case 'months':
                        currentValue = date.getMonth();
                        date.setMonth(currentValue + value);
                        break;
                    default:
                }
            }

            return date;
        };

        /**
         *
         * @param format
         * @param date
         * @returns {Date}
         */
        this.createFromFormat = function createFromFormat(format, date) {
            var defaultFormat = format || 'dd/mm/yyyy',
                parts = date.match(/(\d+)/g),
                partNames = {},
                index = 0;

            defaultFormat = defaultFormat.toLowerCase();
            defaultFormat.replace(/(yyyy|dd|mm)/g, function (part) {
                index += 1;
                partNames[part] = index;
            });

            return new Date(
                parts[partNames.yyyy],
                parts[partNames.mm] - 1,
                parts[partNames.dd]
            );
        };

        /**
         *
         * @param year
         * @returns {boolean}
         */
        this.isLeap = function isLeap(year) {
            var date = new Date(year, 1, 29);

            return 1 === date.getMonth();
        };

        /**
         *
         * @param {Date} date
         * @param {object} property
         * @param {number} value
         * @returns {Date}
         */
        this.sub = function sub(date, property, value) {
            return this.add(date, property, value * -1);
        };

        /**
         *
         * @returns {number}
         */
        this.time = function time() {
            return +new Date();
        };

        /**
         *
         * @param date
         * @returns {string}
         */
        this.toDatabaseString = function toDatabaseString(date) {
            var stringUtils = GRA.utils.StringUtils,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();

            month = stringUtils.padLeft(month, '0', 2);
            day = stringUtils.padLeft(day, '0', 2);
            hour = stringUtils.padLeft(hour, '0', 2);
            minute = stringUtils.padLeft(minute, '0', 2);
            second = stringUtils.padLeft(second, '0', 2);

            return stringUtils.concat([year, month, day], '-') + ' ' + stringUtils.concat([hour, minute, second], ':');
        };

        /**
         *
         * @param {Date} date
         * @returns {string}
         */
        this.toFrenchString = function toFrenchString(date) {
            var stringUtils = GRA.utils.StringUtils,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            month = stringUtils.padLeft(month, '0', 2);
            day = stringUtils.padLeft(day, '0', 2);

            return stringUtils.concat([day, month, year], '/');
        };

        /**
         *
         * @param date
         * @param withSeconds
         * @returns {string}
         */
        this.toFullFrenchString = function toFullFrenchString(date, withSeconds) {
            var frenchDate = this.toFrenchString(date),
                stringUtils = GRA.utils.StringUtils,
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                parts = [],
                useSeconds = !!withSeconds;

            hour = stringUtils.padLeft(hour, '0', 2);
            minute = stringUtils.padLeft(minute, '0', 2);

            parts.push(hour, minute);
            if (useSeconds) {
                second = stringUtils.padLeft(second, '0', 2);
                parts.push(second);
            }

            return frenchDate + ' ' + stringUtils.concat(parts, ':');
        };

        /**
         *
         * @returns {Date}
         */
        this.today = function today() {
            return new Date();
        };

        /**
         *
         * @returns {Date}
         */
        this.tomorrow = function tomorrow() {
            var today = this.today();

            return this.add(today, 'days', 1);
        };

        /**
         * 
         * @param date
         * @returns {number}
         */
        this.weekNumber = function weekNumber(date) {
            var target = new Date(+date),
                targetDay,
                targetDate,
                targetYear = target.getFullYear(),
                firstWeek = new Date(targetYear, 0, 4),
                targetTime,
                firstWeekTime = +firstWeek,
                firstWeekDay = firstWeek.getDay(),
                timeDiff,
                dayDiff;

            target.setHours(0, 0, 0, 0);
            targetDay = target.getDay();
            targetDate = target.getDate();

            target.setDate(targetDate + 3 - (targetDay + 6) % 7);
            targetTime = +target;

            timeDiff = targetTime - firstWeekTime / 86400000;
            dayDiff = 3 - (firstWeekDay + 6) % 7;

            return 1 + Math.round((timeDiff - dayDiff) / 7);
        };

        /**
         *
         * @returns {Date}
         */
        this.yesterday = function yesterday() {
            var today = this.today();

            return this.sub(today, 'days', 1);
        };
    };

    GRA.utils.DateUtils = new GRA.utils.DateUtils();

}(GRA || {}));(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * @class
     */
    GRA.utils.is = {
        /**
         * Permet de tester si la variable est un tableau.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        array: function array(variable) {
            return ("[object Array]" === Object.prototype.toString.call(variable));
        },
        /**
         * Permet de tester si la variable est un booléen.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        boolean: function boolean(variable) {
            return (true === variable || false === variable);
        },
        /**
         * Permet de tester si la variable est un double.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        double: function double(variable) {
            return this.float(variable);
        },
        /**
         * Permet de tester si une variable est vide.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        empty: function empty(variable) {
            var emptyValues = [undefined, null, false, 0, '', '0'],
                empty = true,
                key;

            if (this.array(variable)) {
                empty = (0 === variable.length);
            } else if (this.object(variable)) {
                for (key in variable) {
                    if (variable.hasOwnProperty(key)) {
                        empty = false;
                    }
                }
            } else {
                empty = this.into(emptyValues, variable);
            }

            return empty;
        },
        /**
         * Permet de tester si la ou les variable(s) passée(s) en paramètre sont définie(s).
         *
         * @returns {boolean}
         */
        set: function set(variable) {
            var args = arguments,
                argsLength = arguments.length,
                index = 0,
                existing = true;

            while (existing && index < argsLength) {
                existing = (undefined !== args[index] && null !== args[index]);
                index += 1;
            }

            return existing;
        },
        /**
         * Permet de tester si la variable est un flottant.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        float: function float(variable) {
            var firstCond = +variable === variable,
                secondCond = !isFinite(variable);

            return firstCond && secondCond;
        },
        callable: function callable(variable) {
            var firstCond = variable && variable.constructor,
                secondCond = variable.call && variable.apply;

            return !!(firstCond && secondCond);
        },
        /**
         * Permet de tester si la navigateur de l'utilisateur est Internet Explorer.
         *
         * @returns {boolean}
         */
        ie: function ie() {
            return ("Microsoft Internet Explorer" === window.navigator.appName);
        },
        /**
         * Permet de tester si la variable est un entier.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        integer: function integer(variable) {
            var firstCond = variable === +variable,
                secondCond = isFinite(variable),
                thirdCond = variable % 1;

            return firstCond && secondCond && !thirdCond;
        },
        /**
         * Permet de tester si array contient variable.
         *
         * @param array {Array|object|string}
         * @param variable {*}
         * @returns {boolean}
         */
        into: function into(array, variable) {
            var into = false, index = 0;

            if (this.array(array)) {
                while (!into && index < array.length) {
                    into = array[index] === variable;

                    index += 1;
                }
            } else if (this.object(array)) {
                into = array.hasOwnProperty(variable);
            } else if (this.string(array)) {
                into = -1 !== array.indexOf(variable);
            }

            return into;
        },
        /**
         * Permet de tester si la variable est numérique.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        numeric: function numeric(variable) {
            var ws = " \n\r\t\f",
                wsSlice,
                firstCond = "number" === typeof variable,
                secondCond = "string" === typeof variable,
                thirdCond = true,
                lastCond = ('' !== variable && !isNaN(variable));

            if (secondCond) {
                wsSlice = variable.slice(-1);
                thirdCond = ws.indexOf(wsSlice);
            }
            secondCond = secondCond && thirdCond;

            return (firstCond || secondCond) && lastCond;
        },
        /**
         * Permet de tester si la variable est un objet.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        object: function object(variable) {
            return null !== variable && "object" === typeof variable && !this.array(variable);
        },
        /**
         * Permet de tester si la variable est un scalaire.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        scalar: function scalar(variable) {
            return (/boolean|number|string/).test(typeof variable);
        },
        /**
         * Permet de tester si la variable est une chaîne de caractère.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        string: function string(variable) {
            return "string" === typeof variable;
        }
    };
}(GRA || {}));(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe ObjectUtils
     *
     * @constructor
     */
    GRA.utils.ObjectUtils = function ObjectUtils() {
        /**
         * Permet de retourner le nombre de propriétés d'un objet
         *
         * @param {object} object Objet dans lequel compter
         * @returns {number} Nombre de propriétés de l'objet
         */
        this.countProperties = function countProperties(object) {
            var totalProperties = 0,
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    totalProperties += 1;
                }
            }

            return totalProperties;
        };

        /**
         * Permet d'étendre les propriétés d'un objet à un autre.
         * Cette fonction nécessite JQuery pour fonctionner.
         *
         * @param childObject Objet enfant dans lequel seront copiées les propriétés
         * @param parentObject Objet parent dont les propriétés sont à étendre
         */
        this.deepExtend = function deepExtend(childObject, parentObject) {
            if (window.$) {
                $.extend(true, childObject, parentObject);
            } else {
                throw new Error("L'utilisation de la fonction ObjectUtils::deepExtend() nécessite JQuery");
            }
        };

        /**
         * Permet d'étendre les propriétés d'un objet à un autre.
         *
         * @param childObject Objet enfant dans lequel seront copiées les propriétés
         * @param parentObject Objet parent dont les propriétés sont à étendre
         */
        this.extend = function extend(childObject, parentObject) {
            var property;

            if (GRA.utils.is.callable(parentObject)) {
                parentObject.apply(childObject);
            } else {
                for (property in parentObject) {
                    if (parentObject.hasOwnProperty(property)) {
                        childObject[property] = parentObject[property];
                    }
                }
            }
        };

        /**
         *
         * @param {object} object
         * @param {function} callback
         */
        this.forEachProperties = function forEachProperties(object, callback) {
            var property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    callback(property);
                }
            }
        };

        /**
         * Permet de retourner le nom du callable passé en paramètre.
         *
         * @param callback Callable (fonction) dont le nom est à déterminer
         * @returns {string} Le nom de la fonction (callable)
         */
        this.getFunctionName = function getFunctionName(callback) {
            var callbackToStr = callback.toString(),
                regexTest = (/^function\s+([\w\$]+)\s*\(/).exec(callbackToStr),
                functionName = 'anonymous';

            if (regexTest) {
                functionName = regexTest[1];
            }

            return functionName;
        };

        /**
         * Permet de retourner le nom de la classe de l'objet passé en paramètre
         *
         * @param object Objet dont le nom de la classe est à déterminer
         * @returns {string} Nom de la classe de l'objet
         */
        this.getClassName = function getClassName(object) {
            return this.getFunctionName(object.constructor);
        };

        /**
         * Permet de savoir si la fonction passé en paramètre est anonyme.
         *
         * @param fct Fonction à tester
         * @returns {boolean} TRUE si la fonction est anonyme, FALSE sinon
         */
        this.isAnonymous = function isAnonymous(fct) {
            var fctToStr = fct.toString();

            return null === (/^function\s+([\w\$]+)\s*\(/).exec(fctToStr);
        };

        /**
         * Fusionne deux objets.
         * Le premier objet en paramètre sera la cible de la fusion
         *
         * @param {object} objectTarget Objet cible
         * @param {object} objectB Autre objet
         */
        this.merge = function merge(objectTarget, objectB) {
            var property;

            for (property in objectB) {
                if (objectB.hasOwnProperty(property)) {
                    if (objectB[property].constructor && Object === objectB[property].constructor) {
                        objectTarget[property] = this.merge(objectTarget[property], objectB[property]);
                    } else {
                        objectTarget[property] = objectB[property];
                    }
                }
            }
        };

        /**
         *
         * @param property
         * @param object
         * @returns {boolean}
         */
        this.own = function own(property, object) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en HTML
         *
         * @param htmlString Chaîne de caractères à parser
         * @returns {HTMLElement[]} Le contenu HTML
         */
        this.parseHTML = function parseHTML(htmlString) {
            var element = document.createElement('div');
            element.innerHTML = htmlString;

            return element.children;
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en JSON (objet)
         *
         * @param jsonString Chaîne de caractères à parser
         * @returns {object} Le contenu JSON
         */
        this.parseJSON = function parseJSON(jsonString) {
            return JSON.parse(jsonString);
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en XML
         *
         * @param xmlString Chaîne de caractères à parser
         * @returns {XML} Le contenu XML
         */
        this.parseXML = function parseXML(xmlString) {
            var xml,
                xmlParser;

            if (window.ActiveXObject) {
                xmlParser = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlParser.async = false;
                xml = xmlParser.loadXML(xmlString);
            } else if (window.DOMParser) {
                xmlParser = (new window.DOMParser());
                xml = xmlParser.parseFromString(xmlString, "text/xml");
            } else {
                throw new Error("Aucun parseur XML n'est disponible sur ce navigateur.");
            }

            return xml;
        };

        /**
         * Permet de retourner l'objet sous forme d'une chaîne de caractère JSON
         *
         * @param object Objet à transformer en chaîne
         * @returns {string} Objet sous forme de chaîne de caractères JSON
         */
        this.stringify = function stringify(object) {
            return JSON.stringify(object);
        };
    };

    GRA.utils.ObjectUtils = new GRA.utils.ObjectUtils();

}(GRA || {}));(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe StringUtils
     *
     * @constructor
     */
    GRA.utils.StringUtils = function StringUtils () {

        /**
         *
         * @param {String} str Chaîne à échapper
         * @returns {String}
         */
        this.cleanWordChars = function cleanWordChars(str) {
            var cleaned = str.replace(/[\u2018\u2019\u201A]/g, "\'");

            cleaned = cleaned.replace(/[\u201C\u201D\u201E]/g, "\"");
            cleaned = cleaned.replace(/[\u2013\u2014]/g, "-");
            cleaned = cleaned.replace(/\u2026/g, "...");

            return cleaned;
        };

        /**
         *
         * @param arrayOfStrings
         * @param separator
         * @returns {string|*}
         */
        this.concat = function concat(arrayOfStrings, separator) {
            var defaultSeparator = separator || '';

            return arrayOfStrings.join(defaultSeparator);
        };

        /**
         *
         * @param str
         * @returns {string}
         */
        this.fullTrim = function fullTrim(str) {
            var firstReplace = str.replace(/(^ +}  +\$)/g,''),
                secondReplace = firstReplace.replace(/ +/g, ' ');

            return secondReplace.trim();
        };

        /**
         *
         * @param part
         * @param str
         * @returns {boolean}
         */
        this.has = function has(part, str) {
            return 0 <= str.indexOf(part);
        };

        /**
         *
         * @param str
         * @param char
         * @param length
         * @returns {*}
         */
        this.padLeft = function padLeft(str, char, length) {
            var strPadded = str,
                finalLength = str.length + char.length;

            while (length >= finalLength) {
                strPadded =  char + strPadded;
                finalLength += char.length;
            }

            return strPadded;
        };

        /**
         *
         * @param str
         * @param char
         * @param length
         * @returns {*}
         */
        this.padRight = function padRight(str, char, length) {
            var strPadded = str,
                finalLength = str.length + char.length;

            while (length >= finalLength) {
                strPadded += char;
                finalLength += char.length;
            }

            return strPadded;
        };

        /**
         *
         * @param str
         * @returns {Number}
         */
        this.toFloat = function toFloat(str) {
            return parseFloat(str);
        };

        /**
         *
         * @param str
         * @returns {Number}
         */
        this.toInt = function toInt(str) {
            return parseInt(str, 10);
        };

        /**
         *
         * @param {string} str
         * @returns {string}
         */
        this.ucfirst = function ucfirst(str) {
            var firstChar = str.charAt(0),
                lastChars = str.substr(1);

            firstChar = firstChar.toUpperCase();

            return this.concat([firstChar, lastChars]);
        };

        /**
         *
         * @param {string} str
         */
        this.ucfirstAll = function ucfirstAll(str) {
            var parts = str.split(' '),
                that = this;

            partsUpper = parts.map(function (word) {
                return that.ucfirst(word);
            });

            return partsUpper.join(' ');
        };
    };

    GRA.utils.StringUtils = new GRA.utils.StringUtils();

}(GRA || {}));(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe TokenUtils
     * Utilitaire permettant de générer des chaînes aléatoirement
     *
     * @constructor
     */
    GRA.utils.TokenUtils = function TokenUtils() {
        /**
         * @type {object}
         */
        var type = {
                RANDOM: ['a', 'N', 'z', 'B', 'E', 'v', 'R', 'C', 't', 'x', 'w', 'm', 'y', 'u', 'i', 'l', 'o', 'k', 'p',
                    'Q', 'S', 'd', 'F', 'g', 'h', 'J', 'K', 'A', 'c', '0', '8', '9', '-', '_', '+', '7', 'L', 'O', '4', '6',
                    '5', 'W', 'X', '1', '2', '3', 'H', 'f', 'T', 'M', 'r', 'b', 'e', 'f', 'G', 'I', 'P', 'Y', 'Z', 'V'],
                ALPHA_X: ['a', 'A', 'z', 'Z', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'r', 'R', 't', 'T', 'y', 'Y',
                    'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', 'q', 'Q', 's', 'S', 'D', 'd', 'H', 'j', 'J', 'k', 'K', 'l',
                    'L', 'm', 'M', 'w', 'W', 'x', 'X', 'c', 'C', 'v', 'B', 'n', 'b', 'V', 'N', '0', '1', '9', '8', '2', '3',
                    '7', '6', '4', '5'],
                NUMERIC: ['0', '1', '9', '8', '2', '3', '7', '6', '4', '5'],
                CHARS: ['a', 'A', 'z', 'Z', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'r', 'R', 't', 'T', 'y', 'Y',
                    'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', 'q', 'Q', 's', 'S', 'D', 'd', 'H', 'j', 'J', 'k', 'K', 'l',
                    'L', 'm', 'M', 'w', 'W', 'x', 'X', 'c', 'C', 'v', 'B', 'n', 'b', 'V', 'N']
            },
            isType = function isType(strtype) {
                return type.hasOwnProperty(strtype);
            };

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caracères alphanumériques
         */
        this.ALPHA_X = 'ALPHA_X';

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caractères alphabétiques
         */
        this.CHARS = 'CHARS';

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caractères numériques
         */
        this.NUMERIC = 'NUMERIC';

        /**
         * Constante pour indiquer au générateur d'utiliser n'importe quel caractère
         */
        this.RANDOM = 'RANDOM';

        /**
         * Permet de générer un jeton aléatoire dont la taille varie entre minSize et maxSize.
         * Le générateur utilisera le type de jeton fourni en paramètre ou utilisera le type
         * ALPHA_X pour générer le jeton
         *
         * @param {int} minSize Taille minimale du jeton
         * @param {int} maxSize Taille maximale du jeton
         * @param {string} tokenType Type du jeton
         * @returns {string} Jeton généré
         */
        this.generate = function generate(minSize, maxSize, tokenType) {
            var randomSize = Math.random(),
                size = Math.floor(randomSize * (maxSize - minSize + 1) + minSize),
                index,
                tokenTypeCalc = tokenType || this.ALPHA_X,
                token = "";

            if (!isType(tokenTypeCalc)) {
                throw new Error("TokenUtils : Type de jeton [" + tokenTypeCalc + "] inconnu");
            }

            if (0 >= minSize || 0 >= maxSize) {
                throw new Error("TokenUtils : Taille du jeton demandé incorrecte.");
            }

            for (index = 0; index < size; index += 1) {
                randomSize = Math.random();
                token += type[tokenTypeCalc][Math.floor(randomSize * type[tokenTypeCalc].length)];
            }

            return token;
        };
    };

    GRA.utils.TokenUtils = new GRA.utils.TokenUtils();
}(GRA || {}));