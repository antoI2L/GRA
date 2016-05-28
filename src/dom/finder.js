(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Finder = function Finder() {

        var handlers = {
                'element': new GRA.dom.Element(),
                'collection': new GRA.dom.Collection()
            },
            handler = 'element',
            setHandler = function setHandler(htmlElements) {
                if (1 === htmlElements.length) {
                    handlers.element.decorate(htmlElements[0]);
                    handler = 'element';
                } else {
                    handlers.collection.decorate(htmlElements);
                    handler = 'collection';
                }
            };

        /****************/
        /* Recherche    */
        /****************/

        /**
         *
         * @param selector
         * @returns {number}
         */
        this.count = function count(selector) {
            var from = handlers.element.getElementDecorated();

            return from.querySelectorAll(selector).length;
        };

        /**
         *
         * @param className
         * @returns {number}
         */
        this.countByClass = function countByClass(className) {
            var from = handlers.element.getElementDecorated();

            return from.getElementsByClassName(className).length;
        };

        /**
         *
         * @param selector
         * @returns {GRA.dom.Finder}
         */
        this.find = function find(selector) {
            var from = handlers.element.getElementDecorated(),
                htmlElements = from.querySelectorAll(selector);

            setHandler(htmlElements);

            return this;
        };

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.findByClass = function findByClass(className) {
            var from = handlers.element.getElementDecorated(),
                htmlElements = from.getElementsByClassName(className);

            setHandler(htmlElements);

            return this;
        };

        /**
         *
         * @param id
         * @returns {GRA.dom.Finder}
         */
        this.findById = function findById(id) {
            var from = handlers.element.getElementDecorated(),
                htmlElement = from.getElementById(id);

            handlers.element.decorate(htmlElement);
            handler = 'element';

            return this;
        };

        /**
         *
         * @param selector
         * @returns {GRA.dom.Finder}
         */
        this.findOne = function findOne(selector) {
            var from = handlers.element.getElementDecorated(),
                htmlElement = from.querySelector(selector);

            handlers.element.decorate(htmlElement);
            handler = 'element';

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.reset = function reset() {
            return this.searchFromDocument();
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.searchFromBody = function searchFromBody() {
            handlers.element.decorate(document.body);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.searchFromDocument = function searchFromDocument() {
            handlers.element.decorate(document);

            return this;
        };


        /****************/
        /* Manipulation */
        /****************/

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.addClass = function addClass(className) {
            handlers[handler].addClass(className);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.after = function after(html) {
            handlers[handler].after(html);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.append = function append(html) {
            handlers[handler].append(html);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.before = function before(html) {
            handlers[handler].before(html);

            return this;
        };

        /**
         *
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.each = function each(callback) {
            handlers[handler].each(callback);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.empty = function empty() {
            handlers[handler].empty();

            return this;
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @returns {*|string}
         */
        this.getAttribute = function getAttribute(attributeName, attributeValue) {
            return handlers[handler].getAttribute(attributeName, attributeValue);
        };

        /**
         *
         * @param name
         * @returns {string|*}
         */
        this.getData = function getData(name) {
            return handlers[handler].getData(name);
        };

        /**
         *
         * @returns {*}
         */
        this.getHtml = function getHtml() {
            return handlers[handler].getHtml();
        };

        /**
         *
         * @returns {*}
         */
        this.getText = function getText() {
            return handlers[handler].getText();
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.getParent = function getParent() {
            var parent = handlers[handler].getParent(),
                elementDecorated = parent.getElementDecorated();
            handler = 'element';
            handlers[handler].decorate(elementDecorated);

            return this;
        };

        /**
         *
         * @returns {*|{top, left}|{left, top}}
         */
        this.getPosition = function getPosition() {
            return handlers[handler].getPosition();
        };

        /**
         *
         */
        this.getPositionRelative = function getPositionRelative() {
            return handlers[handler].getPositionRelative();
        };

        /**
         *
         * @param className
         * @returns {*}
         */
        this.hasClass = function hasClass(className) {
            return handlers[handler].hasClass(className);
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.hide = function hide() {
            handlers[handler].hide();

            return this;
        };

        /**
         *
         * @param eventName
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.off = function off(eventName, callback) {
            handlers[handler].off(eventName, callback);

            return this;
        };

        /**
         *
         * @param eventName
         * @param callback
         * @returns {GRA.dom.Finder}
         */
        this.on = function on(eventName, callback) {
            handlers[handler].on(eventName, callback);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.prepend = function prepend(html) {
            handlers[handler].prepend(html);

            return this;
        };

        /**
         *
         */
        this.remove = function remove() {
            handlers[handler].remove();
        };

        /**
         *
         * @param attributeName
         * @returns {GRA.dom.Finder}
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            handlers[handler].removeAttribute(attributeName);

            return this;
        };

        /**
         *
         * @param className
         * @returns {GRA.dom.Finder}
         */
        this.removeClass = function removeClass(className) {
            handlers[handler].removeClass(className);

            return this;
        };

        /**
         *
         * @param name
         * @returns {GRA.dom.Finder}
         */
        this.removeData = function removeData(name) {
            handlers[handler].removeData(name);

            return this;
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @returns {GRA.dom.Finder}
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue) {
            handlers[handler].setAttribute(attributeName, attributeValue);

            return this;
        };

        /**
         *
         * @param name
         * @param value
         * @returns {GRA.dom.Finder}
         */
        this.setData = function setData(name, value) {
            handlers[handler].setData(name, value);

            return this;
        };

        /**
         *
         * @param html
         * @returns {GRA.dom.Finder}
         */
        this.setHtml = function setHtml(html) {
            handlers[handler].setHtml(html);

            return this;
        };

        /**
         *
         * @param text
         * @returns {GRA.dom.Finder}
         */
        this.setText = function setText(text) {
            handlers[handler].setText(text);

            return this;
        };

        /**
         *
         * @returns {GRA.dom.Finder}
         */
        this.show = function show() {
            handlers[handler].show();

            return this;
        };

        /**
         * 
         * @param eventName
         * @returns {GRA.dom.Finder}
         */
        this.trigger = function trigger(eventName) {
            handlers[handler].trigger(eventName);

            return this;
        };
    };

}(GRA || {}));