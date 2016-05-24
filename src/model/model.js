(function (GRA) {

    GRA.model = GRA.model || {};

    /**
     * Classe Model
     * Représente un Model (Data)
     *
     * @param {string} modelName Nom du Modèle
     * @constructor
     */
    GRA.model.Model = function Model(modelName) {
        var name = modelName.toLowerCase(),
            attr,
            relatedForm,
            getSource = function getSource(method, url) {
                var kernel = GRA.kernel.Kernel,
                    source;

                if (kernel.urls.hasOwnProperty(name) && kernel.urls[name].hasOwnProperty(method)) {
                    source = kernel.urls[name][method];
                } else if (url) {
                    source = url;
                } else {
                    throw new Error("Aucune URL source pour GRA.model.Model::" + method + "()");
                }

                return source;
            },
            dispatchFormEvent = function dispatchFormEvent(property) {
                if (relatedForm) {
                    relatedForm.dispatch('model.attribute.update', [property]);
                }
            },
            events = {};

        events['form.field.update'] = function (params) {
            attr[params[0]] = params[1];
        };

        /**
         *
         * @param form
         */
        this.attachTo = function attachTo(form) {
            form.setModel(this);
            relatedForm = form;
        };

        /**
         *
         * @param attribute
         * @param attributeValue
         * @returns {*}
         */
        this.attribute = function attribute(attribute, attributeValue) {
            var value;

            if (attr.hasOwnProperty(attribute)) {
                value = attr[attribute];
            }

            if (attributeValue !== undefined) {
                attr[attribute] = attributeValue;
                dispatchFormEvent(attribute);
                value = this;
            }

            return value;
        };

        /**
         *
         */
        this.clear = function clear() {
            GRA.storage.local.remove('model/' + name);
        };

        /**
         *
         * @param attributes
         */
        this.defineBy = function defineBy(attributes) {
            attr = attributes;
        };

        /**
         *
         * @param eventName
         * @param params
         */
        this.dispatch = function dispatch(eventName, params) {
            if (events.hasOwnProperty(eventName)) {
                events[eventName](params);
            }
        };

        /**
         *
         * @param modelId
         * @param url
         */
        this.find = function find(modelId, url) {
            var source = getSource('find', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.get(source, function (data) {
                GRA.utils.ObjectUtils.forEachProperties(attr, function (property) {
                    model.attr(property, data[property]);

                    dispatchFormEvent(property);
                });
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getName = function getName() {
            return name;
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            events[eventName] = callback;
        };

        /**
         *
         * @param timeToLive
         */
        this.persist = function persist(timeToLive) {
            var modelToObject = this.toObject();

            GRA.storage.local.set('model/' + name, modelToObject, timeToLive);
        };

        /**
         *
         * @param url
         */
        this.remove = function remove(url) {
            var source = getSource('remove', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.delete(source, function () {
                model.dispatch('remove');
            });
        };

        /**
         *
         */
        this.retrieve = function retrieve() {
            var model = GRA.storage.local.get('model/' + name),
                current = this;

            if (model) {
                GRA.utils.ObjectUtils.forEachProperties(attr, function (property) {
                    current.attribute(property, model.attributes[property]);

                    dispatchFormEvent(property);
                });
            }
        };

        /**
         *
         * @param url
         */
        this.save = function save(url) {
            var source = getSource('save', url),
                factory = new GRA.ajax.Factory(),
                ajax = factory.createJsonRequest(),
                model = this;

            ajax.post(source, function () {
                model.dispatch('save');
            });
        };

        /**
         *
         * @returns {{name: string, attributes: *}}
         */
        this.toObject = function toObject() {
            return {
                name: name,
                attributes: attr
            };
        };

        /**
         * 
         * @returns {*|string}
         */
        this.toString = function toString() {
            return GRA.utils.ObjectUtils.stringify({
                name: name,
                attributes: attr
            });
        };
    };

}(GRA || {}));