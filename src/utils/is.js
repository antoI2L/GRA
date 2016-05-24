(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * @class
     */
    GRA.utils.is = {
        /**
         * Permet de tester si la variable est un tableau.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        array: function array(variable) {
            return ("[object Array]" === Object.prototype.toString.call(variable));
        },
        /**
         * Permet de tester si la variable est un booléen.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        boolean: function boolean(variable) {
            return (true === variable || false === variable);
        },
        /**
         * Permet de tester si la variable est un double.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        double: function double(variable) {
            return this.float(variable);
        },
        /**
         * Permet de tester si une variable est vide.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        empty: function empty(variable) {
            var emptyValues = [undefined, null, false, 0, '', '0'],
                empty = true,
                key;

            if (this.array(variable)) {
                empty = (0 === variable.length);
            } else if (this.object(variable)) {
                for (key in variable) {
                    if (variable.hasOwnProperty(key)) {
                        empty = false;
                    }
                }
            } else {
                empty = this.into(emptyValues, variable);
            }

            return empty;
        },
        /**
         * Permet de tester si la ou les variable(s) passée(s) en paramètre sont définie(s).
         *
         * @returns {boolean}
         */
        set: function set(variable) {
            var args = arguments,
                argsLength = arguments.length,
                index = 0,
                existing = true;

            while (existing && index < argsLength) {
                existing = (undefined !== args[index] && null !== args[index]);
                index += 1;
            }

            return existing;
        },
        /**
         * Permet de tester si la variable est un flottant.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        float: function float(variable) {
            var firstCond = +variable === variable,
                secondCond = !isFinite(variable);

            return firstCond && secondCond;
        },
        func: function func(variable) {
            var firstCond = variable && variable.constructor,
                secondCond = variable.call && variable.apply;

            return !!(firstCond && secondCond);
        },
        /**
         * Permet de tester si la navigateur de l'utilisateur est Internet Explorer.
         *
         * @returns {boolean}
         */
        ie: function ie() {
            return ("Microsoft Internet Explorer" === window.navigator.appName);
        },
        /**
         * Permet de tester si la variable est un entier.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        integer: function integer(variable) {
            var firstCond = variable === +variable,
                secondCond = isFinite(variable),
                thirdCond = variable % 1;

            return firstCond && secondCond && !thirdCond;
        },
        /**
         * Permet de tester si array contient variable.
         *
         * @param array {Array|object|string}
         * @param variable {*}
         * @returns {boolean}
         */
        into: function into(array, variable) {
            var into = false, index = 0;

            if (this.array(array)) {
                while (!into && index < array.length) {
                    into = array[index] === variable;

                    index += 1;
                }
            } else if (this.object(array)) {
                into = array.hasOwnProperty(variable);
            } else if (this.string(array)) {
                into = -1 !== array.indexOf(variable);
            }

            return into;
        },
        /**
         * Permet de tester si la variable est numérique.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        numeric: function numeric(variable) {
            var ws = " \n\r\t\f",
                wsSlice,
                firstCond = "number" === typeof variable,
                secondCond = "string" === typeof variable,
                thirdCond = true,
                lastCond = ('' !== variable && !isNaN(variable));

            if (secondCond) {
                wsSlice = variable.slice(-1);
                thirdCond = ws.indexOf(wsSlice);
            }
            secondCond = secondCond && thirdCond;

            return (firstCond || secondCond) && lastCond;
        },
        /**
         * Permet de tester si la variable est un objet.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        object: function object(variable) {
            return null !== variable && "object" === typeof variable && !this.array(variable);
        },
        /**
         * Permet de tester si la variable est un scalaire.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        scalar: function scalar(variable) {
            return (/boolean|number|string/).test(typeof variable);
        },
        /**
         * Permet de tester si la variable est une chaîne de caractère.
         *
         * @param variable {*}
         * @returns {boolean}
         */
        string: function string(variable) {
            return "string" === typeof variable;
        }
    };
}(GRA || {}));