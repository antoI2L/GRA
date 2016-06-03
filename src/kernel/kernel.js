(function (GRA) {
    "use strict";

    var internalApi,
        internalLogger;

    // Initialisation des namespaces
    GRA.kernel = GRA.kernel || {};

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "6000",
        "extendedTimeOut": "1200",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    /**
     * Classe KernelApi
     *
     * @class
     */
    internalApi = (function KernelApi() {
        var api = Object.create(null);

        return {
            /**
             *
             * @param componentName
             */
            conceal: function conceal(componentName) {
                if (this.has(componentName)) {
                    delete api[componentName];
                }
            },
            /**
             *
             * @param componentName
             * @returns {*}
             */
            get: function get(componentName) {
                if (!this.has(componentName)) {
                    throw new Error("");
                }

                return api[componentName];
            },
            /**
             *
             * @param componentName
             * @returns {*|boolean}
             */
            has: function has(componentName) {
                return GRA.utils.ObjectUtils.own(componentName, api);
            },
            /**
             *
             * @param componentName
             * @param component
             */
            provide: function use(componentName, component) {
                api[componentName] = component;
            }
        };
    }());

    /**
     * @class
     */
    internalLogger = (function Logger() {

        var debug,
            isLoggable = function isLoggable() {
                return debug && window.console;
            },
            nowAsString = function nowAsString() {
                var today = new Date();

                return today.toLocaleString();
            };

        return {
            disable: function disable() {
                debug = false;
            },
            enable: function enable() {
                debug = true;
            },
            error: function error(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();

                    if (message instanceof Error) {
                        window.console.error('[ERROR ' + message.fileName + '] ' + today + ', ligne ' + message.lineNumber + ' : ' + message.message);
                    } else {
                        window.console.error('[ERROR] ' + today +  ' : ' + message);
                    }
                }
            },
            info: function info(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.info('[INFO] ' + today +  ' : ' + message);
                }
            },
            log: function log(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.log('[LOG] ' + today + ' : ' + message);
                }
            },
            warning: function warning(message) {
                var today;

                if (isLoggable()) {
                    today = nowAsString();
                    window.console.info('[WARNING] ' + today +  ' : ' + message);
                }
            }
        };
    }());


    /**
     * Classe Kernel
     *
     * @constructor
     */
    GRA.kernel.Kernel = function Kernel() {
        /**
         * @type {boolean}
         */
        var debug,
            /**
             * @type {object}
             */
            applications = Object.create(null),
            /**
             * @type {GRA.kernel.Bus}
             */
            bus = new GRA.kernel.Bus(),
            isBootable = function isBootable(application) {
                return application instanceof GRA.kernel.Application;
            };

        // Initialisation de l'API
        internalApi.provide('logger', internalLogger);

        /**
         * Permet d'accéder l'API du noyau
         *
         * @returns {object}
         */
        this.api = function api() {
            return internalApi;
        };

        /**
         * Permet d'enregistrer une application dans le noyau
         *
         * @param {function} application Application à booter
         */
        this.boot = function boot(application) {
            var app = application(),
                name;

            if (isBootable(app)) {
                name = app.getName();
                internalLogger.info("Enregistrement de l'application [" + name + "]");

                app.init(bus, internalApi);

                applications[name] = {
                    instance: app,
                    started: false
                };

                try {
                    app.dispatch('boot');
                } catch (e) {
                    internalLogger.error(e);
                    toastr.error(e.message, "Erreur survenue");
                }
            }
        };

        /**
         * Permet de retirer un composant de l'API
         *
         * @param {string} componentName
         */
        this.conceal = function conceal(componentName) {
            internalApi.conceal(componentName);
        };

        /**
         * Permet de créer une application
         *
         * @param {string} applicationName Nom de l'application à créer
         * @returns {GRA.kernel.Application} L'Application créée
         */
        this.createApplication = function createApplication(applicationName) {
            return new GRA.kernel.Application(applicationName);
        };

        /**
         * Permet de créer un composant à partir de son nom.
         *
         * @param {String} componentName Nom du composant
         * @returns {*}
         */
        this.createComponent = function createComponent(componentName) {
            var component,
                realComponentName,
                stringUtils = GRA.utils.StringUtils;

            if (GRA.component.hasOwnProperty(componentName)) {
                component = new GRA.component[componentName]();
                component.create();
            } else if (stringUtils.has('-', componentName)) {
                realComponentName = componentName.replace(/\-/g, ' ');
                realComponentName = stringUtils.ucfirstAll(realComponentName);
                realComponentName = realComponentName.replace(/\s/g, '');

                if (GRA.component.hasOwnProperty(realComponentName)) {
                    component = new GRA.component[realComponentName]();
                    component.create();
                }
            }

            return component;
        };

        /**
         * Permet de savoir si une application est attachée ou non au noyau
         *
         * @param {string} applicationId Nom de l'application
         * @returns {boolean} TRUE si l'application est attachée au noyau, FALSE sinon
         */
        this.isBooted = function isBooted(applicationId) {
            return GRA.utils.ObjectUtils.own(applicationId, applications);
        };

        /**
         * Permet de savoir si le noyau est en mode DEBUG ou non
         *
         * @returns {boolean} Mode du noyau
         */
        this.isDebug = function isDebug() {
            return !!debug;
        };

        /**
         * Permet de savoir si une application est démarrée
         *
         * @param {string} applicationId Nom de l'application
         * @returns {boolean} TRUE si l'application est démarrée, FALSE sinon
         */
        this.isStarted = function isStarted(applicationId) {
            var started = false;

            if (this.isBooted(applicationId)) {
                started = applications[applicationId].started;
            }

            return started;
        };

        /**
         * Permet de notifier un message à l'utilisateur
         *
         * @param {string} msg Message à notifier à l'utilisateur
         * @param {string} level Niveau du message
         */
        this.notify = function notify(msg, level) {
            if ('success' === level) {
                toastr.success(msg, "Information");
            } else {
                toastr.info(msg, "Information");
            }
        };

        /**
         * Permet d'ouvrir une page dans un nouvel onglet
         *
         * @param {String} url URL à ouvrir dans un nouvel onglet
         */
        this.openInNewTab = function openInNewTab(url) {
            window.open(url, '_blank');
        };

        /**
         * Permet d'ajouter un composant à l'API
         *
         * @param {string} componentName Nom du composant
         * @param {*} component Composant à ajouter à l'API
         */
        this.provide = function provide(componentName, component) {
            internalApi.provide(componentName, component);
        };

        /**
         * Permet de lever une erreur à l'utilisateur
         *
         * @param {string} msg Message d'erreur à afficher
         */
        this.raiseError = function raiseError(msg) {
            toastr.error(msg, "Erreur survenue");
        };

        /**
         * Permet d'effectuer une redirection
         *
         * @param {String} url URL à laquelle rediriger l'utilisateur
         */
        this.redirect = function redirect(url) {
            document.location.href = url;
        };

        /**
         * Permet de recharger la page
         *
         * @param {Boolean} ignoreCache Ignorer ou non le cache
         */
        this.reloadPage = function reloadPage(ignoreCache) {
            window.location.reload(!!ignoreCache);
        };

        /**
         * Permet de définir si le noyau doit être en mode DEBUG
         *
         * @param {boolean} debugMode Si debug ou non
         */
        this.setDebug = function setDebug(debugMode) {
            debug = !!debugMode;

            internalLogger.disable();
            if (debug) {
                internalLogger.enable();
            }
        };

        /**
         * Permet de démarrer une application
         *
         * @param {string} applicationId Nom de l'application à démarrer
         */
        this.start = function start(applicationId) {
            var fnManager;

            if (!this.isStarted(applicationId)) {
                fnManager = new GRA.fn.Manager();
                fnManager.runWhenReady(function startFunction() {
                    applications[applicationId].started = true;
                    internalLogger.info("L'application [" + applicationId + "] a été démarrée.");

                    try {
                        applications[applicationId].instance.dispatch('start');
                    } catch (e) {
                        internalLogger.error(e);
                        toastr.error(e.message, "Erreur survenue");
                    }

                });
            }
        };

        /**
         * Permet de démarrer toutes les applications
         */
        this.startAll = function startAll() {
            var application;

            for (application in applications) {
                this.start(application);
            }
        };

        /**
         * Permet de stopper une application
         *
         * @param {string} applicationId Nom de l'application à stopper
         */
        this.stop = function stop(applicationId) {
            var self = this,
                fnManager = new GRA.fn.Manager();

            fnManager.runWhenReady(function stopFunction() {
                if (self.isStarted(applicationId)) {
                    applications[applicationId].started = false;
                    try {
                        applications[applicationId].instance.dispatch('stop');
                    } catch (e) {
                        internalLogger.error(e);
                        toastr.error(e.message, "Erreur survenue");
                    }
                }
            });
        };

        /**
         * Permet de stopper toutes les applications
         */
        this.stopAll = function stopAll() {
            var application;

            for (application in applications) {
                this.stop(application);
            }
        };

        /**
         * @type {object}
         */
        this.urls = Object.create(null);

        /**
         * Permet d'avertir l'utilisateur
         *
         * @param {string} msg Message d'avertissement à afficher
         */
        this.warn = function warn(msg) {
            toastr.warning(msg, "Attention");
        };
    };

    GRA.kernel.Kernel = new GRA.kernel.Kernel();
}(GRA || {}));