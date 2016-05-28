(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Collection = function Collection() {

        var elements = [],
            handler = new GRA.dom.Element(),
            arrayUtils = GRA.utils.ArrayUtils;

        /**
         *
         * @param className
         */
        this.addClass = function addClass(className) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.addClass(className);
            });
        };

        /**
         *
         * @param html
         */
        this.after = function after(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.after(html);
            });
        };

        /**
         *
         * @param html
         */
        this.append = function append(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.append(html);
            });
        };

        /**
         *
         * @param html
         */
        this.before = function before(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.before(html);
            });
        };

        /**
         *
         * @param htmlElements
         */
        this.decorate = function decorate(htmlElements) {
            elements = htmlElements;
        };

        /**
         *
         * @param callback
         */
        this.each = function each(callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                callback(handler);
            });
        };

        /**
         *
         */
        this.empty = function empty() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.empty();
            });
        };

        /**
         *
         * @param attributeName
         * @returns {Array}
         */
        this.getAttribute = function getAttribute(attributeName) {
            var attributes = [],
                attribute;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                attribute = handler.getAttribute(attributeName);
                attributes.push(attribute);
            });

            return attributes;
        };

        /**
         *
         * @param name
         * @returns {Array}
         */
        this.getData = function getData(name) {
            return this.getAttribute('data-' + name);
        };

        /**
         *
         * @returns {string}
         */
        this.getHtml = function getHtml() {
            var html = [],
                part;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                part = handler.getHtml();
                html.push(part);
            });

            return html.join(' ');
        };

        /**
         *
         * @returns {string}
         */
        this.getText = function getText() {
            var text = [],
                part;

            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                part = handler.getText();
                text.push(part);
            });

            return text.join(' ');
        };

        /**
         *
         * @returns {*}
         */
        this.getParent = function getParent() {
            var parent = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                parent = handler.getParent();
            }

            return parent;
        };

        /**
         *
         * @returns {*}
         */
        this.getPosition = function getPosition() {
            var position = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                position = handler.getPosition();
            }

            return position;
        };

        /**
         *
         * @returns {*}
         */
        this.getPositionRelative = function getPositionRelative() {
            var position = null;

            if (0 < elements.length) {
                handler.decorate(elements[0]);
                position = handler.getPositionRelative();
            }

            return position;
        };

        /**
         *
         * @returns {boolean}
         */
        this.hasClass = function hasClass() {
            return false;
        };

        /**
         *
         */
        this.hide = function hide() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.hide();
            });
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.off = function off(eventName, callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.off(eventName, callback);
            });
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.on(eventName, callback);
            });
        };

        /**
         *
         * @param html
         */
        this.prepend = function prepend(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.prepend(html);
            });
        };

        /**
         *
         */
        this.remove = function remove() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.remove();
            });

            elements = [];
        };

        /**
         *
         * @param attributeName
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.removeAttribute(attributeName);
            });
        };

        /**
         *
         * @param className
         */
        this.removeClass = function removeClass(className) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.removeClass(className);
            });
        };

        /**
         *
         * @param name
         */
        this.removeData = function removeData(name) {
            this.removeAttribute('data-' + name);
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setAttribute(attributeName, attributeValue);
            });
        };

        /**
         *
         * @param name
         * @param value
         */
        this.setData = function setData(name, value) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setData(name, value);
            });
        };

        /**
         *
         * @param html
         */
        this.setHtml = function setHtml(html) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setHtml(html);
            });
        };

        /**
         *
         * @param text
         */
        this.setText = function setText(text) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.setText(text);
            });
        };

        /**
         *
         */
        this.show = function show() {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.show();
            });
        };

        /**
         * 
         * @param eventName
         */
        this.trigger = function trigger(eventName) {
            arrayUtils.forEach(elements, function (element) {
                handler.decorate(element);
                handler.trigger(eventName);
            });
        };
    };

}(GRA || {}));