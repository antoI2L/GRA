(function (GRA) {
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

}(GRA || {}));