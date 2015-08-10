(function ($) {
    /**
     * Activates asynchronous linking
     *
     * @todo Finish refactoring
     *
     * @param options
     */

    $.fn.asyncActivator = function (options) {
        var defaultOptions = {
            toggler: 'data-toggler',
            togglerClose: 'data-toggler-close',
            togglerOpen: 'data-toggler-open',
            toggle: 'data-toggle',

            asyncEnabled: 'data-async',

            from: 'data-from',
            to: 'data-to',

            container: 'data-container',
            subContainer: 'data-container-content',

            wrapPattern: "[{0}]",
            wrap: function (args, pattern) {
                pattern = pattern || options.wrapPattern;
                return pattern.format(args);
            }
        };

        options = $.extend(defaultOptions, options);

        // Toggling functionality
        $(this)
            .on('click.toggler', options.wrap(options.toggler), function (event) {
                var selector = options.wrap(
                    [options.toggle,  $(this).attr(options.toggler)],
                    '[{0}="{1}"]'
                );

                $(selector).toggle();
            })
            .on('click.toggler.close', options.wrap(options.togglerClose), function (event) {
                var selector = options.wrap(
                    [options.toggle,  $(this).attr(options.togglerClose)],
                    '[{0}="{1}"]'
                );

                $(selector).hide();
            })
            .on('click.toggler.open', options.wrap(options.togglerOpen), function (event) {
                var selector = options.wrap(
                    [options.toggle,  $(this).attr(options.togglerOpen)],
                    '[{0}="{1}"]'
                );

                $(selector).show();
            });

        /**
         *
         */
        $(options.wrap(options.asyncEnabled, '[{0}="true"]')).on('click', 'a[href!="#"], '+ options.wrap(options.from), function (event) {
            var data = $(this).parseData();

            if ($(this).attr('data-method')) return true;

            if (data.from.length && data.to.length) {
                for (var i in data.from) {
                    var containerSelector = options.wrap([options.container, data.to[i]], '[{0}="{1}"]'),
                        subContainerSelector = options.wrap(options.subContainer, '[{0}="true"]'),
                        container = $(containerSelector),
                        subContainer = container.find(subContainerSelector);


                    $.pjax({
                        url: data.from[i],
                        container: subContainer.length ? subContainer : container,
                        timeout: 2000
                    });

                    // Closure for right container
                    (function (container, subContainer) {
                        var source = subContainer && subContainer.length ? subContainer : container;
                        source.on({
                            'pjax:start': function () {
                                if (container.attr(options.toggle)) {
                                    container.hide()
                                }
                            },
                            'pjax:end': function () {
                                if (container.attr(options.toggle)) {
                                    if(source.is(':empty')){
                                        container.hide();
                                    } else {
                                        container.show();
                                    }

                                }
                            }
                        });
                    })(container, subContainer)
                }

            } else {
                console.warn('Unable enable async loading');
            }

            return false;
        });
    };


    /**
     *
     * @returns {{from: Array, to: Array}}
     */
    $.fn.parseData = function (options) {
        var data = $(this).data(),
            parameters = {
                from: data.from ? data.from.split(',') : [],
                to: data.to ? data.to.split(',') : []
            },
            defaultOptions = {
                defaultContainer: 'main'
            };

        options = $.extend(defaultOptions, options);

        if (!parameters.from.length) {
            var href = $(this).attr("href");
            parameters.from = href ? [href] : [];
        }

        if (!parameters.to.length) {
            parameters.to = [ options.defaultContainer ]
        }

        if(!parameters.from.length){
            return { from: [] , to: []}
        }

        if (parameters.from.length != parameters.to.length) {
            throw new Error("Source number is not equal destination ones");
        }

        return parameters;
    };

    /**
     *
     * @returns {*}
     */
    String.prototype.format = function (args) {
        var formatted = this;
        args = Array.isArray(args) ? args : [args];
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    };
})(jQuery);