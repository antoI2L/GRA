(function (GRA) {

    GRA.form = GRA.form || {};

    /**
     * Classe Form
     *
     * @constructor
     */
    GRA.form.Form = function Form() {
        var dom = GRA.dom.JQueryProxy,
            model,
            events = Object.create(null),
            inputs = Object.create(null),
            selects = Object.create(null),
            checkInputs = function checkInputs() {
                var properties = Object.keys(inputs),
                    totalProperties = properties.length,
                    index = 0,
                    result = true;

                while (result && index < totalProperties) {
                    result = result && inputs[properties[index]].valid;
                    index += 1;
                }

                return result;
            },
            checkSelects = function selectInputs() {
                var properties = Object.keys(selects),
                    totalProperties = properties.length,
                    index = 0,
                    result = true;

                while (result && index < totalProperties) {
                    result = result && selects[properties[index]].valid;
                    index += 1;
                }

                return result;
            };

        events['model.attribute.update'] = function (attribute) {
            var element,
                objectUtils = GRA.utils.ObjectUtils,
                value = model.attribute(attribute);

            if (objectUtils.own(attribute, inputs)) {
                element = inputs[attribute];
                element.input.val(value);
                element.input.trigger('keyup');
            } else if (objectUtils.own(attribute, selects)) {
                element = selects[attribute];
                element.select.val(value);
                element.select.trigger('change');
            }
        };

        /**
         *
         * @param modelProperty
         * @param inputSelector
         * @param rules
         */
        this.addInput = function addInput(modelProperty, inputSelector, rules) {
            var input = dom.find(inputSelector),
                form = this;

            inputs[modelProperty] = {
                input: input,
                rules: rules,
                valid: false
            };

            input.on('keyup', function () {
                var validator = form.validator,
                    value = this.value;

                if (model) {
                    model.dispatch('form.field.update', [modelProperty, value]);
                }

                if (validator.validate(value, rules)) {
                    inputs[modelProperty].valid = true;
                    form.dispatch('input.valid', [this]);
                } else {
                    inputs[modelProperty].valid = false;
                    form.dispatch('input.invalid', [this]);
                }
            });
        };

        /**
         *
         * @param modelProperty
         * @param selectSelector
         * @param nullValue
         */
        this.addSelect = function addSelect(modelProperty, selectSelector, nullValue) {
            var select = dom.find(selectSelector),
                form = this;

            selects[modelProperty] = {
                select: select,
                deny: nullValue,
                valid: false
            };

            select.on('change', function () {
                var value = this.value;

                if (model) {
                    model.dispatch('form.field.update', [modelProperty, value]);
                }

                if (value === nullValue) {
                    selects[modelProperty].valid = false;
                    form.dispatch('select.invalid', [this]);
                } else {
                    selects[modelProperty].valid = true;
                    form.dispatch('select.valid', [this]);
                }
            });
        };

        /**
         *
         * @param event
         * @param parameters
         */
        this.dispatch = function dispatch(event, parameters) {
            if (GRA.utils.ObjectUtils.own(event, events)) {
                events[event].apply(null, parameters || []);
            }
        };

        /**
         *
         * @returns {boolean}
         */
        this.isValid = function isValid() {
            var result = checkInputs();

            if (result) {
                result = result && checkSelects();
            }

            return result;
        };

        /**
         *
         * @param event
         * @param callback
         */
        this.on = function on(event, callback) {
            events[event] = callback;
        };

        /**
         *
         * @param modelObject
         */
        this.setModel = function setModel(modelObject) {
            if (!model || model.getName() !== modelObject.getName()) {
                model = modelObject;
                model.attachTo(this);
            }
        };

        /**
         * @type {GRA.form.Validator}
         */
        this.validator = new GRA.form.Validator();
    };

}(GRA || {}));