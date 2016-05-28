(function (GRA) {
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

}(GRA || {}));