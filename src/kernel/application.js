(function (GRA) {
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

}(GRA || {}));