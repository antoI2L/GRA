(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     * Classe JQueryProxy
     * Proxy de JQuery
     *
     * @constructor
     */
    GRA.dom.JQueryProxy = function JQueryProxy() {
        /**
         * 
         * @param className
         * @param selector
         * @returns {*}
         */
        this.addClass = function addClass(className, selector) {
            var elements = $(selector);
            return elements.addClass(className);
        };

        /**
         *
         * @param htmlElement
         * @param selector
         * @returns {*}
         */
        this.append = function append(htmlElement, selector) {
            var elements = $(selector);
            return elements.append(htmlElement);
        };

        /**
         *
         * @param selector
         * @returns {number|jQuery}
         */
        this.count = function count(selector) {
            return $(selector).length;
        };

        /**
         *
         * @param cssClass
         * @returns {number|jQuery}
         */
        this.countByClass = function countByClass(cssClass) {
            return $('.' + cssClass).length;
        };

        /**
         *
         * @param selector
         * @returns {*|jQuery|HTMLElement}
         */
        this.find = function find(selector) {
            return $(selector);
        };

        /**
         *
         * @param cssClass
         * @returns {*|jQuery|HTMLElement}
         */
        this.findByClass = function findByClass(cssClass) {
            return $('.' + cssClass);
        };

        /**
         *
         * @param selectorId
         * @returns {*|jQuery|HTMLElement}
         */
        this.findById = function findById(selectorId) {
            return $('#' + selectorId);
        };

        /**
         *
         * @param selector
         * @param callback
         */
        this.forEach = function forEach(selector, callback) {
            var elements = $(selector);
            elements.each(callback);
        };

        /**
         *
         * @param attributeName
         * @param selector
         * @returns {*}
         */
        this.getAttribute = function getAttribute(attributeName, selector) {
            var elements = $(selector);
            return elements.attr(attributeName);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getChildren = function getChildren(selector) {
            var elements = $(selector);
            return elements.children();
        };

        /**
         *
         * @param dataKey
         * @param selector
         * @returns {*}
         */
        this.getData = function getData(dataKey, selector) {
            var elements = $(selector);
            return elements.data(dataKey);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getHtml = function getHtml(selector) {
            var elements = $(selector);
            return elements.html();
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getNodeName = function getNodeName(selector) {
            return this.getProperty('tagName', selector);
        };

        /**
         *
         * @param selector
         * @returns {*|{top, left}}
         */
        this.getOffset = function getOffset(selector) {
            var elements = $(selector);
            return elements.offset();
        };

        /**
         *
         * @param selector
         * @param parentName
         * @returns {*}
         */
        this.getParent = function getParent(selector, parentName) {
            var elements = $(selector);
            return elements.parent(parentName);
        };

        /**
         *
         * @param selector
         * @returns {*|{top, left}}
         */
        this.getPosition = function getPosition(selector) {
            var elements = $(selector);
            return elements.position();
        };

        /**
         *
         * @param propertyName
         * @param selector
         * @returns {*}
         */
        this.getProperty = function getProperty(propertyName, selector) {
            var elements = $(selector);
            return elements.prop(propertyName);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.getText = function getText(selector) {
            var elements = $(selector);
            return elements.text();
        };

        /**
         *
         * @param input
         * @returns {*}
         */
        this.getValue = function getValue(input) {
            var elements = $(input);
            return elements.val();
        };

        /**
         *
         * @param className
         * @param selector
         * @returns {*}
         */
        this.hasClass = function hasClass(className, selector) {
            var elements = $(selector);
            return elements.hasClass(className);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.hide = function hide(selector) {
            var elements = $(selector);
            return elements.hide();
        };

        /**
         *
         * @param inputCheckbox
         * @returns {*}
         */
        this.isChecked = function isChecked(inputCheckbox) {
            var elements = $(inputCheckbox);
            return elements.is(':checked');
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.isVisible = function isVisible(selector) {
            var elements = $(selector);
            return elements.is(':visible');
        };

        /**
         *
         * @param htmlElement
         * @param selector
         * @returns {*}
         */
        this.prepend = function prepend(htmlElement, selector) {
            var elements = $(selector);
            return elements.prepend(htmlElement);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.remove = function remove(selector) {
            var elements = $(selector);
            return elements.remove();
        };

        /**
         *
         * @param className
         * @param selector
         * @returns {*}
         */
        this.removeClass = function removeClass(className, selector) {
            var elements = $(selector);
            return elements.removeClass(className);
        };

        /**
         *
         * @param attributeName
         * @param attributeValue
         * @param selector
         * @returns {*}
         */
        this.setAttribute = function setAttribute(attributeName, attributeValue, selector) {
            var elements = $(selector);
            return elements.attr(attributeName, attributeValue);
        };

        /**
         *
         * @param dataKey
         * @param dataValue
         * @param selector
         * @returns {*}
         */
        this.setData = function setData(dataKey, dataValue, selector) {
            var elements = $(selector);
            return elements.data(dataKey, dataValue);
        };

        /**
         *
         * @param htmlContent
         * @param selector
         * @returns {*}
         */
        this.setHtml = function setHtml(htmlContent, selector) {
            var elements = $(selector);
            return elements.html(htmlContent);
        };

        /**
         *
         * @param propertyName
         * @param propertyValue
         * @param selector
         * @returns {*}
         */
        this.setProperty = function setProperty(propertyName, propertyValue, selector) {
            var elements = $(selector);
            return elements.prop(propertyName, propertyValue);
        };

        /**
         *
         * @param textContent
         * @param selector
         * @returns {*}
         */
        this.setText = function setText(textContent, selector) {
            var elements = $(selector);
            return elements.text(textContent);
        };

        /**
         *
         * @param value
         * @param input
         * @returns {*}
         */
        this.setValue = function setValue(value, input) {
            var elements = $(input);
            return elements.val(value);
        };

        /**
         *
         * @param selector
         * @returns {*}
         */
        this.show = function show(selector) {
            var elements = $(selector);
            return elements.show();
        };
    };

    GRA.dom.JQueryProxy = new GRA.dom.JQueryProxy();

}(GRA || {}));