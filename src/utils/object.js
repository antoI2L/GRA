(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe ObjectUtils
     *
     * @constructor
     */
    GRA.utils.ObjectUtils = function ObjectUtils() {
        /**
         * Permet de retourner le nombre de propriétés d'un objet
         *
         * @param {object} object Objet dans lequel compter
         * @returns {number} Nombre de propriétés de l'objet
         */
        this.countProperties = function countProperties(object) {
            var totalProperties = 0,
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    totalProperties += 1;
                }
            }

            return totalProperties;
        };

        /**
         * Permet d'étendre les propriétés d'un objet à un autre.
         * Cette fonction nécessite JQuery pour fonctionner.
         *
         * @param childObject Objet enfant dans lequel seront copiées les propriétés
         * @param parentObject Objet parent dont les propriétés sont à étendre
         */
        this.deepExtend = function deepExtend(childObject, parentObject) {
            if (window.$) {
                $.extend(true, childObject, parentObject);
            } else {
                throw new Error("L'utilisation de la fonction ObjectUtils::deepExtend() nécessite JQuery");
            }
        };

        /**
         * Permet d'étendre les propriétés d'un objet à un autre.
         *
         * @param childObject Objet enfant dans lequel seront copiées les propriétés
         * @param parentObject Objet parent dont les propriétés sont à étendre
         */
        this.extend = function extend(childObject, parentObject) {
            var property;

            if (GRA.utils.is.callable(parentObject)) {
                parentObject.apply(childObject);
            } else {
                for (property in parentObject) {
                    if (parentObject.hasOwnProperty(property)) {
                        childObject[property] = parentObject[property];
                    }
                }
            }
        };

        /**
         *
         * @param {object} object
         * @param {function} callback
         */
        this.forEachProperties = function forEachProperties(object, callback) {
            var property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    callback(property);
                }
            }
        };

        /**
         * Permet de retourner le nom du callable passé en paramètre.
         *
         * @param callback Callable (fonction) dont le nom est à déterminer
         * @returns {string} Le nom de la fonction (callable)
         */
        this.getFunctionName = function getFunctionName(callback) {
            var callbackToStr = callback.toString(),
                regexTest = (/^function\s+([\w\$]+)\s*\(/).exec(callbackToStr),
                functionName = 'anonymous';

            if (regexTest) {
                functionName = regexTest[1];
            }

            return functionName;
        };

        /**
         * Permet de retourner le nom de la classe de l'objet passé en paramètre
         *
         * @param object Objet dont le nom de la classe est à déterminer
         * @returns {string} Nom de la classe de l'objet
         */
        this.getClassName = function getClassName(object) {
            return this.getFunctionName(object.constructor);
        };

        /**
         * Permet de savoir si la fonction passé en paramètre est anonyme.
         *
         * @param fct Fonction à tester
         * @returns {boolean} TRUE si la fonction est anonyme, FALSE sinon
         */
        this.isAnonymous = function isAnonymous(fct) {
            var fctToStr = fct.toString();

            return null === (/^function\s+([\w\$]+)\s*\(/).exec(fctToStr);
        };

        /**
         * Fusionne deux objets.
         * Le premier objet en paramètre sera la cible de la fusion
         *
         * @param {object} objectTarget Objet cible
         * @param {object} objectB Autre objet
         */
        this.merge = function merge(objectTarget, objectB) {
            var property;

            for (property in objectB) {
                if (objectB.hasOwnProperty(property)) {
                    if (objectB[property].constructor && Object === objectB[property].constructor) {
                        objectTarget[property] = this.merge(objectTarget[property], objectB[property]);
                    } else {
                        objectTarget[property] = objectB[property];
                    }
                }
            }
        };

        /**
         *
         * @param property
         * @param object
         * @returns {boolean}
         */
        this.own = function own(property, object) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en HTML
         *
         * @param htmlString Chaîne de caractères à parser
         * @returns {HTMLElement[]} Le contenu HTML
         */
        this.parseHTML = function parseHTML(htmlString) {
            var element = document.createElement('div');
            element.innerHTML = htmlString;

            return element.children;
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en JSON (objet)
         *
         * @param jsonString Chaîne de caractères à parser
         * @returns {object} Le contenu JSON
         */
        this.parseJSON = function parseJSON(jsonString) {
            return JSON.parse(jsonString);
        };

        /**
         * Permet de parser (transformer) la chaîne de caractères en XML
         *
         * @param xmlString Chaîne de caractères à parser
         * @returns {XML} Le contenu XML
         */
        this.parseXML = function parseXML(xmlString) {
            var xml,
                xmlParser;

            if (window.ActiveXObject) {
                xmlParser = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlParser.async = false;
                xml = xmlParser.loadXML(xmlString);
            } else if (window.DOMParser) {
                xmlParser = (new window.DOMParser());
                xml = xmlParser.parseFromString(xmlString, "text/xml");
            } else {
                throw new Error("Aucun parseur XML n'est disponible sur ce navigateur.");
            }

            return xml;
        };

        /**
         * Permet de retourner l'objet sous forme d'une chaîne de caractère JSON
         *
         * @param object Objet à transformer en chaîne
         * @returns {string} Objet sous forme de chaîne de caractères JSON
         */
        this.stringify = function stringify(object) {
            return JSON.stringify(object);
        };
    };

    GRA.utils.ObjectUtils = new GRA.utils.ObjectUtils();

}(GRA || {}));