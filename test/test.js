var lessmin = require('../lessmin/index');

var parser = new lessmin.Parser();
var data = parser.parse({
        minimize : true,
        input : 'test/less/importfile.less',
        callback : function(data) {
            console.log(data);
        }
    }
);

