(function (GRA) {
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

}(GRA || {}));