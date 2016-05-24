(function (GRA) {
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

}(GRA || {}));