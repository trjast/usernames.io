module.exports = {
    capitalize: function (str) {
        return str.substr(0, 1).toLocaleUpperCase() + 
        str.substr(1,str.length);
    }
};