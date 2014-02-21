var   path = require('path')
    , fs = require('fs')
    , lessmin;

if (lessmin === undefined) {
    lessmin = exports;
}

lessmin.Walk = (function() {

    var reImport = /@import\s*"[^"]+";/g,
    reImportCommas = /"[^"]+"/g,
    reLessFile = /[\w]*(\.less)$/,
    data = '';


    /**
     * Return array of imports contained in string in format '@import "some";'
     * @param data
     * @returns {Array|{index: number, input: string}}
     */
    function getImports(data) {
        return data.match(reImport);
    }

    /**
     * Add *.less to less file
     * @param importString
     * @returns {string}
     */
    function getFilename(importString) {
        var name = importString.match(reImportCommas)[0];
        name = name.substr(0, name.length-1).substr(1);
        if (!name.match(reLessFile)) name = name.concat('.less');
        return name;
    }

    /**
     * Replace @import 'string'; with 'string'
     * @param content
     * @param toBeReplaced
     * @param replacement
     * @returns {*}
     */
    function replace(content, toBeReplaced, replacement) {
        content = content.replace(toBeReplaced, replacement);
        return content;
    }

    /**
     * Walk throughout imports from rootfile
     * @param rootfile
     * @param importString
     */
    function getData(rootfile, importString) {
        var file = rootfile;
        var dir = path.dirname(file);
        var content = fs.readFileSync(file).toString();
        if (data == '') data = content;
        else data = replace(data, importString, content);
        var imports = getImports(data);
        if (imports !== null) {
            imports.forEach(function(importer) {
                var fileName = getFilename(importer);
                var filePath = path.join(dir, fileName);
                if (!fs.existsSync(filePath)) return;
                getData(filePath, importer);
            });
        }
    }

    return function(file) {
        getData(file);
        return data;
    }
})();