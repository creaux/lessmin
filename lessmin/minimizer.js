var lessmin;

if (lessmin === undefined) {
    lessmin = exports;
    lessmin.String = require('./string').String;
}

lessmin.Minimizer = (function(){

    var Comments = {
        singleRE : /(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s])+\/\/(?:.*)$)/gm,
        multiRE : /\*[\w'\s\r\n\.\*\/#\^]*\*\//g,
        rmSingle : function(data) {
            var re = this.singleRE;
            return lessmin.String.rm(data, re);
        },
        rmMulti : function(data) {
            var re = this.multiRE;
            return lessmin.String.rm(data, re);
        }
    };

    function rmWhitespaces(_data) {
        var data = _data;
        data = data.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
        // now all comments, newlines and tabs have been removed
        data = data.replace( / {2,}/g, ' ' );
        // now there are no more than single adjacent spaces left
        // now unnecessary: data = data.replace( /(\s)+\./g, ' .' );
        data = data.replace( / ([{:}]) /g, '$1' );
        data = data.replace( /([;,]) /g, '$1' );
        data = data.replace( / !/g, '!' );
        return data;
    }

    return function() {
        this.minimize = function(data) {
            data = Comments.rmSingle(data); // TODO: Rewrite to chaining data = data.rmSingle().rmMulti();
            data = Comments.rmMulti(data);
            return rmWhitespaces(data);
        };
    };

})();





