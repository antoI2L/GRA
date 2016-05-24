(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe Vector.
     * Représente un Vector
     *
     * @constructor
     */
    GRA.datastructure.Vector = function Vector() {
        /**
         * @type {Array}
         */
        var data = [],
            /**
             * Permet de créer un itérateur sur le vector
             * passé en paramètre
             *
             * @param {Vector} vector Vecteur à itérer
             * @constructor
             */
            VectorIterator = function VectorIterator(vector) {
                /**
                 * @type {number}
                 */
                var index = 0,
                    /**
                     * @type {GRA.datastructure.Vector}
                     */
                    collection = vector;

                /**
                 * Permet d'exécuter une fonction sur chaque élément de l'itérateur
                 *
                 * @param callback Fonction à exécuter sur chaque élément
                 */
                this.forEach = function forEach(callback) {
                    var item;

                    for (item = this.first(); this.hasNext(); item = this.next()) {
                        callback(item);
                    }
                };

                /**
                 * Permet de retourner le premier élément de l'itérateur.
                 * L'itérateur pointera alors sur le deuxième élément du vector
                 *
                 * @returns {*} Premier élément de l'itérateur
                 */
                this.first = function first() {
                    this.reset();

                    return this.next();
                };

                /**
                 * Permet de savoir si l'itérateur possède encore des éléments à parcourir
                 *
                 * @returns {boolean} TRUE si l'itérateur n'est pas à la fin, FALSE sinon
                 */
                this.hasNext = function hasNext() {
                    return collection.size() >= index;
                };

                /**
                 * Permet de retourner le prochain élément de l'itérateur
                 *
                 * @returns {*}
                 */
                this.next = function next() {
                    var element = collection.elementAt(index);
                    index += 1;

                    return element;
                };

                /**
                 * Réinitialise l'itérateur
                 */
                this.reset = function reset() {
                    index -= index;
                };
            };

        /**
         * Permet d'ajouter des éléments dans le Vector
         *
         * @param {...*}
         */
        this.add = function add() {
            var argIndex;

            for (argIndex = 0; argIndex < arguments.length; argIndex += 1) {
                data.push(arguments[argIndex]);
            }
        };

        /**
         * Permet d'insérer une liste d'éléments dans le Vector
         *
         * @param {Array} arrayOfData Tableau de données à insérer
         */
        this.addAll = function addAll(arrayOfData) {
            var index,
                totalData = arrayOfData.length;

            if (!GRA.utils.is.array(arrayOfData)) {
                throw new TypeError("La méthode Vector::addAll() ne prend en paramètre qu'un unique tableau.");
            }

            for (index = 0; index < totalData; index += 1) {
                this.add(arrayOfData[index]);
            }
        };

        /**
         * Permet de vider le vector
         */
        this.clear = function clear() {
            GRA.utils.ArrayUtils.clear(data);
        };

        /**
         * Permet de retourner l'élément se trouvant à l'indice passé en paramètre
         *
         * @param index Indice de l'élément à retourner
         * @returns {*} Element situé à l'indice fourni en paramètre
         */
        this.elementAt = function elementAt(index) {
            var element;

            if (index < this.size()) {
                element = data[index];
            }

            return element;
        };

        /**
         * Permet de retourner le premier élément du vector
         *
         * @returns {*} Premier élément du vector
         */
        this.firstElement = function firstElement() {
            var element;

            if (!this.isEmpty()) {
                element = data[0];
            }

            return element;
        };

        /**
         * Permet d'exécuter une fonction sur chaque élément du vector
         *
         * @param callback Fonction à exécuter sur chaque élément du vector
         */
        this.forEach = function forEach(callback) {
            GRA.utils.ArrayUtils.forEach(data, callback);
        };

        /**
         * Permet de savoir si le vector contient l'élément passé en paramètre
         *
         * @param element Elément à chercher
         * @returns {boolean} TRUE si l'élément est contenu dans le vector, FALSE sinon
         */
        this.has = function has(element) {
            return -1 < this.indexOf(element);
        };

        /**
         * Permet de retourner l'indice de l'élément fourni en paramètre.
         * Si l'élément n'est pas trouvé, cette fonction retournera -1.
         *
         * @param {*} element Element dont l'indice est à rechercher
         * @returns {number} Position de l'élément dans le vector
         */
        this.indexOf = function indexOf(element) {
            return GRA.utils.ArrayUtils.indexOf(element, data);
        };

        /**
         * Permet de savoir si le vector est vide
         *
         * @returns {boolean} TRUE si le vector est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === this.size();
        };

        /**
         * Permet de retourner un itérateur sur le vector
         *
         * @returns {VectorIterator} Itérateur
         */
        this.iterator = function iterator() {
            return new VectorIterator(this);
        };

        /**
         * Permet de retourner une chaîne de caractères dont chaque élément du vector sera
         * concaténé ensemble. Si le délimiteur est spécifié, le délimiteur sera concaténé entre deux éléments.
         * Si le délimiteur n'est pas spécifié, les éléments seront concaténés via une virgule.
         *
         * @param {string} [delimiter] Delimiteur
         * @returns {string} Element concaténé sous forme de chaîne de caractères
         */
        this.join = function join(delimiter) {
            return data.join(delimiter);
        };

        /**
         * Permet de retourner le dernier élément du vector
         *
         * @returns {*} Le dernier élément du vector
         */
        this.lastElement = function lastElement() {
            var element;

            if (!this.isEmpty()) {
                element = data[this.size() - 1];
            }

            return element;
        };

        /**
         * Permet de supprimer l'élément fourni en paramètre du vector
         *
         * @param element Elément à supprimer
         * @returns {*} Le résultat de la suppression
         */
        this.remove = function remove(element) {
            var index = GRA.utils.ArrayUtils.indexOf(element, data);

            return this.removeElementAt(index);
        };

        /**
         * Permet de supprimer les éléments contenus dans le tableau fourni en paramètre du vector
         *
         * @param array Liste d'éléments à supprimer
         */
        this.removeAll = function removeAll(array) {
            var index;

            if (!GRA.utils.is.array(array)) {
                throw new Error('Le paramètre de Vector::removeAll() doit être un tableau.');
            }

            for (index = 0; index < array.length; index += 1) {
                this.remove(array[index]);
            }
        };

        /**
         * Permet de supprimer l'élément se trouvant à l'indice fourni en paramètre
         *
         * @param index Indice de l'élément à supprimer
         * @returns {*} L'élément supprimé si la suppression a été effectuée, undefined sinon
         */
        this.removeElementAt = function removeElementAt(index) {
            var element;

            if (index < this.size()) {
                element = data.splice(index, 1);
            }

            return element;
        };

        /**
         * Permet d'inverser les éléments du vector
         */
        this.reverse = function reverse() {
            data.reverse();
        };

        /**
         * Permet de retourner la taille du vector
         *
         * @returns {Number} Taille du vector
         */
        this.size = function size() {
            return data.length;
        };

        /**
         * Permet d'ordonner les éléments du vector en fonction de la fonction passée en paramètre.
         * La fonction recevra en paramètre deux éléments à comparer
         *
         * @param {function} sortFunction Fonction de tri
         */
        this.sort = function sort(sortFunction) {
            data.sort(sortFunction);
        };

        /**
         * Permet d'ordonner les éléments du vector par ordre croissant
         */
        this.sortAsc = function sortAsc() {
            data.sort();
        };

        /**
         * Permet d'ordonner les éléments du vector par ordre décroissant
         */
        this.sortDesc = function sortDesc() {
            var sortInt = function sortInt(a, b) {
                    return b - a;
                },
                sortString = function sortString(a, b) {
                    return b.toString().localeCompare(a);
                };

            if (isNaN(data[0])) {
                data.sort(sortString);
            } else {
                data.sort(sortInt);
            }
        };

        /**
         * Permet de retourner le vector sous la forme d'un tableau
         *
         * @returns {Array} Vector sous forme d'un tableau
         */
        this.toArray = function toArray() {
            return data;
        };
    };

}(GRA || {}));