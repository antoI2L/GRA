(function (GRA) {

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

}(GRA || {}));