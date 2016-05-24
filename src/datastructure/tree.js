(function (GRA) {

    GRA.datastructure = GRA.datastructure || {};

    /**
     * Classe BinarySearchTree
     * Représente un Arbre Binaire de Recherche
     *
     * @constructor
     */
    GRA.datastructure.BinarySearchTree = function BinarySearchTree() {
        var Node = function Node(nodeKey, nodeValue, isRoot) {
            var root = !!isRoot,
                nodeId = nodeKey,
                data = nodeValue,
                leftNode,
                rightNode;

            /**
             *
             * @returns {*}
             */
            this.id = function id() {
                return nodeId;
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insert = function insert(key, value, comparator) {
                var comparison = comparator(nodeId, key);

                if (0 <= comparison) {
                    this.insertLeft(key, value, comparator);
                } else {
                    this.insertRight(key, value, comparator);
                }
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insertLeft = function insertLeft(key, value, comparator) {
                if (leftNode) {
                    leftNode.insert(key, value, comparator);
                } else {
                    leftNode = new Node(key, value);
                }
            };

            /**
             *
             * @param key
             * @param value
             * @param comparator
             */
            this.insertRight = function insertRight(key, value, comparator) {
                if (rightNode) {
                    rightNode.insert(key, value, comparator);
                } else {
                    rightNode = new Node(key, value);
                }
            };

            /**
             *
             * @returns {boolean}
             */
            this.isLeaf = function isLeaf() {
                return !left && !right;
            };

            /**
             *
             * @returns {boolean}
             */
            this.isRoot = function isRoot() {
                return root;
            };

            /**
             *
             * @returns {*}
             */
            this.left = function left() {
                return leftNode;
            };

            /**
             *
             * @returns {*}
             */
            this.right = function right() {
                return rightNode;
            };
            
            /**
             *
             * @param node
             */
            this.setLeftNode = function setLeftNode(node) {
                leftNode = node;
            };

            /**
             *
             * @param node
             */
            this.setRightNode = function setRightNode(node) {
                rightNode = node;
            };

            /**
             *
             * @returns {*}
             */
            this.value = function value() {
                return data;
            };
        },
        compare = function compare(valA, valB) {
            var result = 1;

            if (valA === valB) {
                result = 0;
            } else if (valA < valB) {
                result = -1;
            }

            return result;
        },
        rootNode,
        nodeLength = 0,
        lastSearchIterations = 0,
        strategies = {
            'depth_first': function depthFirst(needle, node) {
                var result = null,
                    rootId = node.id(),
                    left,
                    right;

                lastSearchIterations += 1;

                if (needle === rootId) {
                    result = node.value();
                } else if (needle < rootId && node.left()) {
                    left = node.left();
                    result = this.depth_first(needle, left);
                } else if (node.right()) {
                    right = node.right();
                    result = this.depth_first(needle, right);
                }

                return result;
            }
        };

        this.DEPTH_FIRST = 'depth_first';

        /**
         *
         * @param key
         * @param value
         */
        this.add = function add(key, value) {
            var comparison,
                rootId;

            if (this.isEmpty()) {
                this.setRoot(key, value);
            } else {
                rootId = rootNode.id();
                comparison = compare(rootId, key);

                if (0 <= comparison) {
                    rootNode.insertLeft(key, value, compare);
                } else {
                    rootNode.insertRight(key, value, compare);
                }
            }

            nodeLength += 1;

            return this;
        };

        this.countNodes = function countNodes() {
            return nodeLength;
        };

        this.countIterations = function countIterations() {
            return lastSearchIterations;
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return !rootNode;
        };

        /**
         *
         * @returns {*}
         */
        this.root = function root() {
            return rootNode;
        };

        /**
         *
         * @param needle
         * @param strategy
         * @returns {*}
         */
        this.search = function search(needle, strategy) {
            var result;

            lastSearchIterations = 0;
            if (strategies.hasOwnProperty(strategy)) {
                result = strategies[strategy](needle, rootNode);
            }

            return result;
        };

        /**
         *
         * @param compareFunction
         */
        this.setComparator = function setComparator(compareFunction) {
            compare = compareFunction;
        };

        /**
         *
         * @param nodeId
         * @param nodeValue
         */
        this.setRoot = function setRoot(nodeId, nodeValue) {
            rootNode = new Node(nodeId, nodeValue, true);

            return this;
        };
    };

}(GRA || {}));