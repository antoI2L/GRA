(function (GRA) {

    GRA.storage = GRA.storage || {};

    /**
     * Classe LocalStorage
     * Permet de manipuler le stockage local du navigateur
     *
     * @constructor
     */
    GRA.storage.local = function LocalStorage() {

        var isExpired = function isExpired(date, ttl) {
                var now = +new Date();

                return ttl && ((now - date) > (ttl * 10 * 10 * 10));
            },
            setTtl = function setTtl(value, ttl) {
                return GRA.utils.ObjectUtils.stringify({
                    item: value,
                    date: (+new Date()),
                    ttl: ttl
                });
            },
            toStr = function toStr(value) {
                var valueToStr = value;

                if (!GRA.utils.is.string(value)) {
                    valueToStr = GRA.utils.ObjectUtils.stringify(value);
                }

                return valueToStr;
            };

        /**
         *
         */
        this.clear = function clear() {
            localStorage.clear();
        };

        /**
         *
         * @returns {boolean}
         */
        this.isEmpty = function isEmpty() {
            return 0 === localStorage.length;
        };

        /**
         *
         * @param key
         * @param defaultValue
         * @returns {*}
         */
        this.get = function get(key, defaultValue) {
            var object,
                item = defaultValue;

            if (this.has(key)) {
                object = localStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    localStorage.removeItem(key);
                } else {
                    try {
                        item = GRA.utils.ObjectUtils.parseJSON(object.item);
                    } catch (e) {
                        item = object.item;
                    }
                }
            }

            return item;
        };

        /**
         *
         * @param key
         * @returns {boolean}
         */
        this.has = function has(key) {
            return localStorage.hasOwnProperty(key);
        };

        /**
         *
         */
        this.refresh = function refresh() {
            var index,
                storageSize = localStorage.length,
                key,
                object;

            for (index = 0; index < storageSize; index += 1) {
                key = localStorage.key(index);
                object = localStorage.getItem(key);
                object = GRA.utils.ObjectUtils.parseJSON(object);

                if (isExpired(object.date, object.ttl)) {
                    localStorage.removeItem(key);
                }
            }
        };

        /**
         *
         * @param key
         */
        this.remove = function remove(key) {
            localStorage.removeItem(key);
        };

        /**
         *
         * @param key
         * @param value
         * @param timeToLive
         */
        this.set = function set(key, value, timeToLive) {
            var valueToStr = toStr(value),
                ttl = timeToLive || null,
                objectToStore = setTtl(valueToStr, ttl);

            localStorage.setItem(key, objectToStore);
        };
    };

    GRA.storage.local = new GRA.storage.local();

}(GRA || {}));