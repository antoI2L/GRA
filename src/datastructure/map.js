(function (GRA) {

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

}(GRA || {}));