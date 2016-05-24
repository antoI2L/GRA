(function (GRA) {

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

}(GRA || {}));