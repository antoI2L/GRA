(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe StringUtils
     *
     * @constructor
     */
    GRA.utils.StringUtils = function StringUtils () {

        /**
         *
         * @param {String} str Chaîne à échapper
         * @returns {String}
         */
        this.cleanWordChars = function cleanWordChars(str) {
            var cleaned = str.replace(/[\u2018\u2019\u201A]/g, "\'");

            cleaned = cleaned.replace(/[\u201C\u201D\u201E]/g, "\"");
            cleaned = cleaned.replace(/[\u2013\u2014]/g, "-");
            cleaned = cleaned.replace(/\u2026/g, "...");

            return cleaned;
        };

        /**
         *
         * @param arrayOfStrings
         * @param separator
         * @returns {string|*}
         */
        this.concat = function concat(arrayOfStrings, separator) {
            var defaultSeparator = separator || '';

            return arrayOfStrings.join(defaultSeparator);
        };

        /**
         *
         * @param str
         * @returns {string}
         */
        this.fullTrim = function fullTrim(str) {
            var firstReplace = str.replace(/(^ +}  +\$)/g,''),
                secondReplace = firstReplace.replace(/ +/g, ' ');

            return secondReplace.trim();
        };

        /**
         *
         * @param part
         * @param str
         * @returns {boolean}
         */
        this.has = function has(part, str) {
            return 0 <= str.indexOf(part);
        };

        /**
         *
         * @param str
         * @param char
         * @param length
         * @returns {*}
         */
        this.padLeft = function padLeft(str, char, length) {
            var strPadded = str,
                finalLength = str.length + char.length;

            while (length >= finalLength) {
                strPadded =  char + strPadded;
                finalLength += char.length;
            }

            return strPadded;
        };

        /**
         *
         * @param str
         * @param char
         * @param length
         * @returns {*}
         */
        this.padRight = function padRight(str, char, length) {
            var strPadded = str,
                finalLength = str.length + char.length;

            while (length >= finalLength) {
                strPadded += char;
                finalLength += char.length;
            }

            return strPadded;
        };

        /**
         *
         * @param str
         * @returns {Number}
         */
        this.toFloat = function toFloat(str) {
            return parseFloat(str);
        };

        /**
         *
         * @param str
         * @returns {Number}
         */
        this.toInt = function toInt(str) {
            return parseInt(str, 10);
        };

        /**
         *
         * @param {string} str
         * @returns {string}
         */
        this.ucfirst = function ucfirst(str) {
            var firstChar = str.charAt(0),
                lastChars = str.substr(1);

            firstChar = firstChar.toUpperCase();

            return this.concat([firstChar, lastChars]);
        };

        /**
         *
         * @param {string} str
         */
        this.ucfirstAll = function ucfirstAll(str) {
            var parts = str.split(' '),
                that = this;

            partsUpper = parts.map(function (word) {
                return that.ucfirst(word);
            });

            return partsUpper.join(' ');
        };
    };

    GRA.utils.StringUtils = new GRA.utils.StringUtils();

}(GRA || {}));