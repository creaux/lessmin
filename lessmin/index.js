var lessmin = {
    Parser : require('./parser').Parser
};

for (var k in lessmin) { if (lessmin.hasOwnProperty(k)) { exports[k] = lessmin[k]; }}