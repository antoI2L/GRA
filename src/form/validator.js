(function (GRA) {

    GRA.form = GRA.form || {};

    /**
     *
     * @constructor
     */
    GRA.form.Validator = function Validator() {
        var rules = new GRA.datastructure.Map(),
            errors = new GRA.datastructure.Stack();

        /**
         *
         * @param ruleName
         * @param checker
         * @param instruction
         */
        this.addRule = function addRule(ruleName, checker, instruction) {
            rules.put(ruleName, {
                check: checker,
                instruction: instruction
            });
        };

        /**
         *
         * @returns {GRA.datastructure.Stack}
         */
        this.getErrors = function getErrors() {
            return errors;
        };

        /**
         *
         * @returns {boolean}
         */
        this.hasErrors = function hasErrors() {
            return !errors.isEmpty();
        };

        /**
         *
         * @param value
         * @param arrayOfRules
         * @returns {boolean}
         */
        this.validate = function validate(value, arrayOfRules) {
            GRA.utils.ArrayUtils.forEach(arrayOfRules, function (ruleName) {
                var rule = rules.get(ruleName);

                if (!rule.check(value)) {
                    errors.push(rule.instruction);
                }
            });

            return errors.isEmpty();
        };
    };

}(GRA || {}));