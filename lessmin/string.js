var lessmin;

if (lessmin === undefined) {
    lessmin = exports;
}

lessmin.String = {
    rm : function(data, string) {
        return data.replace(string, '');
    }
};