(function (GRA) {

    GRA.component = GRA.component || {};

    /**
     *
     * @constructor
     */
    GRA.component.BackToTop = function BackToTop() {

        var selector = '#gra-back-to-top',
            html = [
                '<a id="gra-back-to-top" href="#" class="btn gra-button-bleu-edf btn-lg" role="button" title="Retour en haut de page" data-toggle="tooltip" data-placement="left">',
                '<span class="glyphicon glyphicon-chevron-up"></span></a>'
            ].join('');

        /**
         *
         */
        this.create = function create() {
            var body = $('body'),
                thisHtml = $('html'),
                thisWindow = $(window),
                backToTop;

            body.append(html);
            backToTop = $(selector);
            backToTop.tooltip('show');

            thisWindow.on('scroll', function () {
                if (5 * 10 < thisWindow.scrollTop()) {
                    backToTop.fadeIn();
                }
                else {
                    backToTop.fadeOut();
                }
            });

            backToTop.on('click', function (e) {
                e.preventDefault();

                backToTop.tooltip('hide');
                thisHtml.animate({
                    scrollTop: 0
                }, 5 * 10 * 10);
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getCssSelector = function getCssSelector() {
            return selector;
        };
    };

}(GRA || {}));