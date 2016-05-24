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

}(GRA || {}));