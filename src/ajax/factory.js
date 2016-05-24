/**
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
}(GRA || {}));