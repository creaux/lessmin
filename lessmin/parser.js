var lessmin;

if (lessmin === undefined) {
    lessmin = exports;
    lessmin.Walk = require('./walk').Walk;
    lessmin.Minimizer = require('./minimizer').Minimizer;
}

lessmin.Parser = function(){

    var minimize = false,
        file = null,
        walk;

    this.parse = function() {
        // Options for parser

        var minimize = arguments[0].minimize || null;
        var input = arguments[0].input || null;


        var data;

        if (input) {
            walk = new lessmin.Walk(input);
            data = walk.data();
        }
        var minimizer = new lessmin.Minimizer();
        if (minimize) data = minimizer.minimize(data);
        return data;
    };
};