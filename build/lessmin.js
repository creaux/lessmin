/**
 * Created by creaux on 01/02/14.
 */

var fs = require('fs')
    , path = require('path');

var Lessmin = (function() {

    var logging = true,
        data = '';

    function log(value) {
        if (logging) console.log(value);
    }

    /**
     * Clear inline comments
     * @param _content
     * @returns {*}
     */

    function clearInlineComments(data) {
        // Maybe both
        var re = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm;
        return data.replace(re, '');
    }

    /**
     * Clear multiline comments
     * @param _content
     * @returns {*}
     */

    function clearMultilineComments(data) {
        var re = /\*[\w'\s\r\n\.\*\/#\^]*\*\//g;
        return data.replace(re, '');
    }

    /**
     * Minimize less code in string
     * @param _content
     * @returns {*}
     */
    function minimize(_content) {
        var content = _content;
        content = content.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
        // now all comments, newlines and tabs have been removed
        content = content.replace( / {2,}/g, ' ' );
        // now there are no more than single adjacent spaces left
        // now unnecessary: content = content.replace( /(\s)+\./g, ' .' );
        content = content.replace( / ([{:}]) /g, '$1' );
        content = content.replace( /([;,]) /g, '$1' );
        content = content.replace( / !/g, '!' );
        return content;
    }

    /**
     * Return array of imports contained in string in format '@import "some";'
     * @param _content
     * @returns {Array|{index: number, input: string}}
     */
    function getImports(_content) {
        var content =  _content
          , regex = /@import\s*"[^"]+";/g
          , imports =  content.match(regex);
        return imports;
    }

    /**
     * Add *.less to less file
     * @param _importFile
     * @returns {string}
     */
    function addLessName(_importFile) {
        var importFile = _importFile
          , filePath
          , name
          , regex = /"[^"]+"/g
          , regexLess = /[\w]*(\.less)$/; //TODO: Regex with /

        name = importFile.match(regex)[0];
        name = name.substr(0, name.length-1).substr(1);
        //log(name);
        if (!name.match(regexLess)) name = name.concat('.less');
        //log(name);
        filePath = name;
        return filePath;
    }

    /**
     * Replace @import 'string'; with 'string'
     * @param _content
     * @param _toBeReplaced
     * @param _replacement
     * @returns {*}
     */
    function replace(_content, _toBeReplaced, _replacement) {
        var content = _content;
        var toBeReplaced = _toBeReplaced;
        var replacement = _replacement;
        //console.log(replacement);
        content = content.replace(toBeReplaced, replacement);
        //console.log(content);
        return content;
    }

    /**
     * Walk throughout imports from rootfile
     * @param rootfile
     * @param importString
     */
    function walk(rootfile, importString) {
        var file = rootfile;
        //log(file);
        var dir = path.dirname(file); //TODO: Dir var have to be defined for scope
        var content = fs.readFileSync(file).toString();
        if (data == '') data = content;
        else data = replace(data, importString, content);
        var imports = getImports(data);
        if (imports !== null)
            imports.forEach(function(importer) {
                var fileName = addLessName(importer);
                log(fileName);
                var filePath = path.join(dir, fileName);
                log(filePath);
                walk(filePath, importer);
            });
        else dir = path.join(path.sep(dir).splice(-1,1));  //TODO: Remove last element from array
    }

    return function(rootfile) {
        walk(rootfile);
        log(data);
        var withoutInline = clearInlineComments(data);
        log(withoutInline);
        var withoutMultiline = clearMultilineComments(withoutInline);
        log(withoutMultiline);
        var minimized = minimize(withoutMultiline);
        log(minimized);
    }

})();

var minimizer = new Lessmin('../test/importfile.less');