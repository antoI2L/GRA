(function (GRA) {
    "use strict";

    GRA.utils = GRA.utils || {};

    /**
     * Classe DateUtils
     * Utilitaire permettant de manipuler facilement les dates
     *
     * @constructor
     */
    GRA.utils.DateUtils = function DateUtils() {

        /**
         *
         * @param {Date} date
         * @param {object} property
         * @param {number} value
         * @returns {Date}
         */
        this.add = function add(date, property, value) {
            var getter = 'get' + GRA.utils.StringUtils.ucfirst(property),
                setter = 'set' + GRA.utils.StringUtils.ucfirst(property),
                currentValue;

            if (date.hasOwnProperty(setter)) {
                currentValue = date[getter]();
                date[setter](currentValue + value);
            } else {
                switch (property) {
                    case 'days':
                        currentValue = date.getDate();
                        date.setDate(currentValue + value);
                        break;
                    case 'years':
                        currentValue = date.getFullYear();
                        date.setFullYear(currentValue + value);
                        break;
                    case 'weeks':
                        currentValue = date.getDate();
                        date.setDate(currentValue + (value * 7));
                        break;
                    case 'months':
                        currentValue = date.getMonth();
                        date.setMonth(currentValue + value);
                        break;
                    default:
                }
            }

            return date;
        };

        /**
         *
         * @param format
         * @param date
         * @returns {Date}
         */
        this.createFromFormat = function createFromFormat(format, date) {
            var defaultFormat = format || 'dd/mm/yyyy',
                parts = date.match(/(\d+)/g),
                partNames = {},
                index = 0;

            defaultFormat = defaultFormat.toLowerCase();
            defaultFormat.replace(/(yyyy|dd|mm)/g, function (part) {
                index += 1;
                partNames[part] = index;
            });

            return new Date(
                parts[partNames.yyyy],
                parts[partNames.mm] - 1,
                parts[partNames.dd]
            );
        };

        /**
         *
         * @param year
         * @returns {boolean}
         */
        this.isLeap = function isLeap(year) {
            var date = new Date(year, 1, 29);

            return 1 === date.getMonth();
        };

        /**
         *
         * @param {Date} date
         * @param {object} property
         * @param {number} value
         * @returns {Date}
         */
        this.sub = function sub(date, property, value) {
            return this.add(date, property, value * -1);
        };

        /**
         *
         * @returns {number}
         */
        this.time = function time() {
            return +new Date();
        };

        /**
         *
         * @param date
         * @returns {string}
         */
        this.toDatabaseString = function toDatabaseString(date) {
            var stringUtils = GRA.utils.StringUtils,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();

            month = stringUtils.padLeft(month, '0', 2);
            day = stringUtils.padLeft(day, '0', 2);
            hour = stringUtils.padLeft(hour, '0', 2);
            minute = stringUtils.padLeft(minute, '0', 2);
            second = stringUtils.padLeft(second, '0', 2);

            return stringUtils.concat([year, month, day], '-') + ' ' + stringUtils.concat([hour, minute, second], ':');
        };

        /**
         *
         * @param {Date} date
         * @returns {string}
         */
        this.toFrenchString = function toFrenchString(date) {
            var stringUtils = GRA.utils.StringUtils,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            month = stringUtils.padLeft(month, '0', 2);
            day = stringUtils.padLeft(day, '0', 2);

            return stringUtils.concat([day, month, year], '/');
        };

        /**
         *
         * @param date
         * @param withSeconds
         * @returns {string}
         */
        this.toFullFrenchString = function toFullFrenchString(date, withSeconds) {
            var frenchDate = this.toFrenchString(date),
                stringUtils = GRA.utils.StringUtils,
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                parts = [],
                useSeconds = !!withSeconds;

            hour = stringUtils.padLeft(hour, '0', 2);
            minute = stringUtils.padLeft(minute, '0', 2);

            parts.push(hour, minute);
            if (useSeconds) {
                second = stringUtils.padLeft(second, '0', 2);
                parts.push(second);
            }

            return frenchDate + ' ' + stringUtils.concat(parts, ':');
        };

        /**
         *
         * @returns {Date}
         */
        this.today = function today() {
            return new Date();
        };

        /**
         *
         * @returns {Date}
         */
        this.tomorrow = function tomorrow() {
            var today = this.today();

            return this.add(today, 'days', 1);
        };

        /**
         * 
         * @param date
         * @returns {number}
         */
        this.weekNumber = function weekNumber(date) {
            var target = new Date(+date),
                targetDay,
                targetDate,
                targetYear = target.getFullYear(),
                firstWeek = new Date(targetYear, 0, 4),
                targetTime,
                firstWeekTime = +firstWeek,
                firstWeekDay = firstWeek.getDay(),
                timeDiff,
                dayDiff;

            target.setHours(0, 0, 0, 0);
            targetDay = target.getDay();
            targetDate = target.getDate();

            target.setDate(targetDate + 3 - (targetDay + 6) % 7);
            targetTime = +target;

            timeDiff = targetTime - firstWeekTime / 86400000;
            dayDiff = 3 - (firstWeekDay + 6) % 7;

            return 1 + Math.round((timeDiff - dayDiff) / 7);
        };

        /**
         *
         * @returns {Date}
         */
        this.yesterday = function yesterday() {
            var today = this.today();

            return this.sub(today, 'days', 1);
        };
    };

    GRA.utils.DateUtils = new GRA.utils.DateUtils();

}(GRA || {}));