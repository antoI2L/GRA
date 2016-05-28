(function (GRA) {

    GRA.dom = GRA.dom || {};

    /**
     *
     * @constructor
     */
    GRA.dom.Element = function Element() {

        var element = document;

        /**
         *
         * @param className
         */
        this.addClass = function addClass(className) {
            if (!GRA.utils.StringUtils.has(className, element.className)) {
                element.className += ' ' + className;
            }
        };

        /**
         *
         * @param html
         */
        this.after = function after(html) {
            element.insertAdjacentHTML('afterend', html);
        };

        /**
         *
         * @param html
         */
        this.append = function append(html) {
            element.insertAdjacentHTML('beforeend', html);
        };

        /**
         *
         * @param html
         */
        this.before = function before(html) {
            element.insertAdjacentHTML('beforebegin', html);
        };

        /**
         *
         * @returns {Node}
         */
        this.clone = function clone() {
            return element.cloneNode(true);
        };

        /**
         *
         * @param child
         * @returns {boolean|*}
         */
        this.contains = function contains(child) {
            return element !== child && element.contains(child);
        };

        /**
         *
         * @param htmlElement
         */
        this.decorate = function decorate(htmlElement) {
            element = htmlElement;
        };

        /**
         *
         * @param callback
         */
        this.each = function each(callback) {
            callback(element);
        };

        /**
         *
         */
        this.empty = function empty() {
            element.innerHTML = '';
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return '' === element.innerHTML;
        };

        /**
         *
         * @param attributeName
         * @returns {*|*|string|string}
         */
        this.getAttribute = function getAttribute(attributeName) {
            return element.getAttribute(attributeName);
        };

        /**
         *
         * @param name
         * @returns {*|*|string|string}
         */
        this.getData = function getData(name) {
            return this.getAttribute('data-' + name);
        };

        /**
         *
         * @returns {*|HTMLDocument}
         */
        this.getElementDecorated = function getElementDecorated() {
            return element;
        };

        /**
         *
         * @returns {string|*}
         */
        this.getHtml = function getHtml() {
            return element.innerHTML;
        };

        /**
         *
         * @returns {*}
         */
        this.getText = function getText() {
            return element.textContent;
        };

        /**
         *
         * @returns {GRA.dom.Element}
         */
        this.getParent = function getParent() {
            element = element.parentNode;

            return this;
        };

        /**
         *
         * @returns {{left: (number|Number), top: (number|Number)}}
         */
        this.getPosition = function getPosition() {
            return {
                left: element.offsetLeft,
                top: element.offsetTop
            };
        };

        /**
         *
         * @returns {ClientRect}
         */
        this.getPositionRelative = function getPositionRelative() {
            return element.getBoundingClientRect();
        };

        /**
         *
         * @param className
         * @returns {boolean}
         */
        this.hasClass = function hasClass(className) {
            var regex = new RegExp('(^| )' + className + '( |$)', 'gi');

            return regex.test(element.className);
        };

        /**
         *
         */
        this.hide = function hide() {
            element.style.display = 'none';
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.off = function off(eventName, callback) {
            element.removeEventListener(eventName, callback);
        };

        /**
         *
         * @param eventName
         * @param callback
         */
        this.on = function on(eventName, callback) {
            element.addEventListener(eventName, callback);
        };

        /**
         *
         * @param html
         */
        this.prepend = function prepend(html) {
            element.insertBefore(html, element.firstChild);
        };

        /**
         *
         */
        this.remove = function remove() {
            element.parentNode.removeChild(element);
            element = document;
        };

        /**
         *
         * @param className
         */
        this.removeClass = function removeClass(className) {
            var toArray = className.split(' '),
                toRegex = toArray.join('|'),
                regex = new RegExp('(^|\\b)' + toRegex + '(\\b|$)', 'gi');

            element.className = element.className.replace(regex, ' ');
        };

        /**
         *
         * @param attributeName
         */
        this.removeAttribute = function removeAttribute(attributeName) {
            element.removeAttribute(attributeName);
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
            element.setAttribute(attributeName, attributeValue);
        };

        /**
         *
         * @param name
         * @param value
         */
        this.setData = function setDate(name, value) {
            element.setAttribute('data-' + name, value);
        };

        /**
         *
         * @param html
         */
        this.setHtml = function setHtml(html) {
            element.innerHTML = html;
        };

        /**
         *
         * @param text
         */
        this.setText = function setText(text) {
            element.textContent = text;
        };

        /**
         *
         */
        this.show = function show() {
            element.style.display = '';
        };

        /**
         * 
         * @param eventName
         */
        this.trigger = function trigger(eventName) {
            var event = document.createEvent('HTMLEvents');

            event.initEvent(eventName, true, false);
            element.dispatchEvent(event);
        };
    };

}(GRA || {}));