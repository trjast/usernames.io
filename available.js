var request = require('request')
var q = require('q');

module.exports = {
    check: function (service, username) {
        var defered = q.defer();

        if(typeof service == 'undefined') {
            defered.reject("service undefined");
            return defered.promise;
        }
        if(typeof username == 'undefined') {
            defered.reject("username undefined");
            return defered.promise;
        }

        console.log("[Service Requested] = " + service);

        var destUrl;
        switch(service.toLowerCase()) {
            case "url":
                destUrl = "http://" + username + ".com";
                break;
            case "facebook":
                destUrl = "https://www.facebook.com/" + username;
                break;
            case "twitter":
                destUrl = "https://twitter.com/" + username;
                break;
            case "github":
                destUrl = "https://github.com/" + username;
                break;
            case "linkedin":
                destUrl = "https://www.linkedin.com/in/" + username;
                break;
            default:
                defered.reject("invalid service");
                return defered.promise;
        }

        // have to fake the user-agent in order to bypass Facebook's supported browsers -- let's be chrome!
        var options = {
            url: destUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
            }
        };

        request(options, function (error, res, body) {
            var unique = (typeof res == 'undefined' || res.statusCode == 404);  // lets see what we caught!
            if(!unique) unique = ((res.toString()).search(/(not\sfound)/i) > -1);   // if we didn't get a 404 page *cough* facebook *cough* then let's regex to see if the a 404 is found

            defered.resolve(unique);
        });

        return defered.promise;
    }
};