(function (GRA) {

    GRA.utils = GRA.utils || {};

    /**
     * Classe TokenUtils
     * Utilitaire permettant de générer des chaînes aléatoirement
     *
     * @constructor
     */
    GRA.utils.TokenUtils = function TokenUtils() {
        /**
         * @type {object}
         */
        var type = {
                RANDOM: ['a', 'N', 'z', 'B', 'E', 'v', 'R', 'C', 't', 'x', 'w', 'm', 'y', 'u', 'i', 'l', 'o', 'k', 'p',
                    'Q', 'S', 'd', 'F', 'g', 'h', 'J', 'K', 'A', 'c', '0', '8', '9', '-', '_', '+', '7', 'L', 'O', '4', '6',
                    '5', 'W', 'X', '1', '2', '3', 'H', 'f', 'T', 'M', 'r', 'b', 'e', 'f', 'G', 'I', 'P', 'Y', 'Z', 'V'],
                ALPHA_X: ['a', 'A', 'z', 'Z', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'r', 'R', 't', 'T', 'y', 'Y',
                    'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', 'q', 'Q', 's', 'S', 'D', 'd', 'H', 'j', 'J', 'k', 'K', 'l',
                    'L', 'm', 'M', 'w', 'W', 'x', 'X', 'c', 'C', 'v', 'B', 'n', 'b', 'V', 'N', '0', '1', '9', '8', '2', '3',
                    '7', '6', '4', '5'],
                NUMERIC: ['0', '1', '9', '8', '2', '3', '7', '6', '4', '5'],
                CHARS: ['a', 'A', 'z', 'Z', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'r', 'R', 't', 'T', 'y', 'Y',
                    'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', 'q', 'Q', 's', 'S', 'D', 'd', 'H', 'j', 'J', 'k', 'K', 'l',
                    'L', 'm', 'M', 'w', 'W', 'x', 'X', 'c', 'C', 'v', 'B', 'n', 'b', 'V', 'N']
            },
            isType = function isType(strtype) {
                return type.hasOwnProperty(strtype);
            };

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caracères alphanumériques
         */
        this.ALPHA_X = 'ALPHA_X';

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caractères alphabétiques
         */
        this.CHARS = 'CHARS';

        /**
         * Constante pour indiquer au générateur de n'utiliser que des caractères numériques
         */
        this.NUMERIC = 'NUMERIC';

        /**
         * Constante pour indiquer au générateur d'utiliser n'importe quel caractère
         */
        this.RANDOM = 'RANDOM';

        /**
         * Permet de générer un jeton aléatoire dont la taille varie entre minSize et maxSize.
         * Le générateur utilisera le type de jeton fourni en paramètre ou utilisera le type
         * ALPHA_X pour générer le jeton
         *
         * @param {int} minSize Taille minimale du jeton
         * @param {int} maxSize Taille maximale du jeton
         * @param {string} tokenType Type du jeton
         * @returns {string} Jeton généré
         */
        this.generate = function generate(minSize, maxSize, tokenType) {
            var randomSize = Math.random(),
                size = Math.floor(randomSize * (maxSize - minSize + 1) + minSize),
                index,
                tokenTypeCalc = tokenType || this.ALPHA_X,
                token = "";

            if (!isType(tokenTypeCalc)) {
                throw new Error("TokenUtils : Type de jeton [" + tokenTypeCalc + "] inconnu");
            }

            if (0 >= minSize || 0 >= maxSize) {
                throw new Error("TokenUtils : Taille du jeton demandé incorrecte.");
            }

            for (index = 0; index < size; index += 1) {
                randomSize = Math.random();
                token += type[tokenTypeCalc][Math.floor(randomSize * type[tokenTypeCalc].length)];
            }

            return token;
        };
    };

    GRA.utils.TokenUtils = new GRA.utils.TokenUtils();
}(GRA || {}));