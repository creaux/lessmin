var lessmin;

if (lessmin === undefined) {
    lessmin = exports;
    lessmin.Walk = require('./walk').Walk;
    lessmin.Minimizer = require('./minimizer').Minimizer;
}

lessmin.Parser = (function(){

    var minimize = false,
        file = null;

    return function() {

        this.parse = function(options) {
            // Options for parser
            if (options) {
                var minimize = options.minimize || null;
                var input = options.input || null;
                var callback = options.callback || null;
            }

            var data;

            if (input) data = lessmin.Walk(input);
            var minimizer = new lessmin.Minimizer();
            if (minimize) data = minimizer.minimize(data);
            callback(data);
        };
    }
})();