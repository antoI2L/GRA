/**
 * Fichier src/datastructure/linkedlist.js
 *
 * @author D'oria Antony
 * @package GRA.datastructure
 * @version 1.0
 */
(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe LinkedList
     *
     * @constructor
     */
    GRA.datastructure.LinkedList = function LinkedList() {
        var length = 0,
            head;

        /**
         * Permet d'ajouter une valeur à la liste
         *
         * @param {*} value Valeur à ajouter
         * @returns {Node} Element ajouté à la liste
         */
        this.add = function add(value) {
            var node = {
                    value: value,
                    next: null
                },
                currentNode = head;

            if (head) {
                while (currentNode.next) {
                    currentNode = currentNode.next;
                }

                currentNode.next = node;
            } else {
                head = node;
            }
            length += 1;

            return node;
        };

        /**
         * Permet d'appliquer une fonction sur chaque élément de la liste
         * La valeur de l'élément courant sera passé en paramètre de la fonction
         *
         * @param {function} callback Fonction à appliquer sur chaque élément de la liste
         */
        this.forEach = function forEach(callback) {
            var currentNode = head;

            while (currentNode.next) {
                callback(currentNode.value);
                currentNode = currentNode.next;
            }
        };

        /**
         * Permet de retourner l'élément à l'indice fourni en paramètre
         *
         * @param {number} index Indice de l'élément
         * @returns {Node} Element de la liste
         */
        this.get = function get(index) {
            var currentNode = head,
                len = 0,
                element;

            if (0 > index || index > this.size()) {
                element = null;
            } else if (0 === index) {
                element = head;
            } else {
                while (len < index) {
                    currentNode = currentNode.next;
                    len += 1;
                }

                element = currentNode;
            }

            return element.value;
        };

        /**
         * Permet de retourner le premier élément de la liste
         *
         * @returns {Node} Tête de la liste
         */
        this.getFirst = function getFirst() {
            return head.value;
        };

        /**
         * Permet de retourner la tête de la liste
         *
         * @returns {Node} Tête de la liste
         */
        this.getHead = function getHead() {
            return head;
        };

        /**
         * Permet de retourner le dernier élément de la liste
         *
         * @returns {Node} Dernier élément de la liste
         */
        this.getLast = function getLast() {
            var currentNode = head,
                lastElement;

            if (this.isEmpty()) {
                lastElement = null;
            } else if (1 === this.size()) {
                lastElement = head;
            } else {
                while (currentNode.next) {
                    currentNode = currentNode.next;
                }

                lastElement = currentNode;
            }

            return lastElement.value;
        };

        /**
         * Permet de savoir si la liste est vide
         *
         * @returns {boolean} TRUE si la liste est vide, FALSE sinon
         */
        this.isEmpty = function isEmpty() {
            return 0 === this.size();
        };

        /**
         * Permet de supprimer l'élément dont la position est fournie en paramètre
         *
         * @param {number} index Position de l'élément à supprimer
         * @return {boolean} Résultat de la suppression
         */
        this.removeAt = function removeAt(index) {
            var currentNode = head,
                position = 0,
                beforeNode,
                nodeToDelete,
                deletedNode;

            if (0 > index || index > this.size()) {
                deletedNode = false;
            } else if (0 === index) {
                head = currentNode.next;
                deletedNode = true;
                //currentNode = null;
                length -= 1;
            } else {
                while (position < index) {
                    beforeNode = currentNode;
                    nodeToDelete = currentNode.next;
                    position += 1;
                }

                beforeNode.next = nodeToDelete.next;
                deletedNode = true;
                nodeToDelete = null;
                length -= 1;
            }

            return deletedNode;
        };

        /**
         * Permet de retourner la taille de la liste chaînée
         *
         * @returns {number} Taille de la liste
         */
        this.size = function size() {
            return length;
        };
    };

}(GRA || {}));