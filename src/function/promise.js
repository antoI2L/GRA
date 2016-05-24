(function (GRA) {

    GRA.fn = GRA.fn || {};

    /**
     * @type {object}
     */
    GRA.fn.PromiseState = {
        PENDING: 0,
        RESOLVED: 1,
        REJECTED: -1
    };

    /**
     * Classe Promise
     *
     * @param {function} fn
     * @constructor
     */
    GRA.fn.Promise = function Promise(fn) {
        var state = GRA.fn.PromiseState.PENDING,
            value,
            deferred,
            handle = function handle(handler) {
                var returnValue,
                    handlerCallback;

                if (state === GRA.fn.PromiseState.PENDING) {
                    deferred = handler;
                } else {
                    setTimeout(function () {
                        if (state === GRA.fn.PromiseState.RESOLVED) {
                            handlerCallback = handler.onResolved;
                        } else {
                            handlerCallback = handler.onRejected;
                        }

                        if (handlerCallback) {
                            try {
                                returnValue = handlerCallback(value);
                                handler.resolve(returnValue);
                            } catch (e) {
                                handler.reject(e);
                            }
                        } else if (state === GRA.fn.PromiseState.RESOLVED) {
                            handler.resolve(value);
                        } else {
                            handler.reject(value);
                        }
                    }, 5);
                }
            },
            reject = function reject(reason) {
                state = GRA.fn.PromiseState.REJECTED;
                value = reason;

                if (deferred) {
                    handle(deferred);
                }
            },
            resolve = function resolve(newValue) {
                try {
                    if (newValue instanceof GRA.fn.Promise) {
                        newValue.then(resolve);
                    } else {
                        value = newValue;
                        state = GRA.fn.PromiseState.RESOLVED;

                        if (deferred) {
                            handle(deferred);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            };

        /**
         *
         * @param onError
         */
        this.onError = function onError(onError) {
            setTimeout(function () {
                handle({
                    onResolved: null,
                    onRejected: onError
                });
            }, 5);
        };

        /**
         *
         * @param onResolved
         * @param onRejected
         */
        this.done = function done(onResolved, onRejected) {
            setTimeout(function () {
                handle({
                    onResolved: onResolved,
                    onRejected: onRejected
                });
            }, 5);
        };

        /**
         *
         *
         * @param {function} onFailure
         * @returns {GRA.fn.Promise}
         */
        this.fail = function fail(onFailure) {
            return new GRA.fn.Promise(function (resolve, reject) {
                handle({
                    onResolved: null,
                    onRejected: onFailure,
                    resolve: resolve,
                    reject: reject
                });
            });
        };

        /**
         *
         * @returns {number}
         */
        this.getState = function getState() {
            return state;
        };

        /**
         *
         * @param onResolved
         * @param onRejected
         * @returns {GRA.fn.Promise}
         */
        this.then = function then(onResolved, onRejected) {
            return new GRA.fn.Promise(function (resolve, reject) {
                handle({
                    onResolved: onResolved,
                    onRejected: onRejected,
                    resolve: resolve,
                    reject: reject
                });
            });
        };

        /**
         *
         * @returns {*}
         */
        this.val = function val() {
            return value;
        };

        fn(resolve, reject);
    };

}(GRA || {}));