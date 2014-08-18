var request = require('request'),
    utils = require('./utils'),
    cap = utils.capitalize,
    q = require('q'),
    wordnik_token = "721d3bfd50df487a1680c0537ca01260c2a0ca2b83ce751fd",
    descriptor_maxlength = "6",
    idiom_maxlength = "10";

function generateUsername(defered) {
    var descriptorType = "verb";
    if(Math.round(Math.random()))
        descriptorType = "adjective";
    console.log("Generating username using [" + descriptorType + "] + [idiom]");

    // First lets get the descriptor (either a verb or adjective)
    request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=" + descriptorType + "&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=" + descriptor_maxlength + "&api_key="+ wordnik_token, function (error, res, body) {
        if (error || res.statusCode != 200) {
            defered.reject(error || res.statusCode);
        } else {
            var descriptorRes = JSON.parse(body);
            var descriptor = descriptorRes.word;
            console.log("[" + descriptorType + "] = " + descriptor);

            // Sweet! Now lets get that idiom to seal the deal
            request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=idiom&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=" + idiom_maxlength + "&api_key=" + wordnik_token, function (error, res, body) {
                if (error || res.statusCode != 200) {
                    defered.reject(error || res.statusCode);
                } else {
                    var idiomRes = JSON.parse(body);
                    var idiom = idiomRes.word;
                    console.log("[idiom] = " + idiom);

                    // Now make it beautiful
                    var username = cap(descriptor) + cap(idiom);
                    console.log("Result: " + username + "\n");
                    defered.resolve(username.replace(/[|&:;$%@'"<>()`~+,]/g, ""));
                }
            });
        }
    });
}

module.exports = {
    get: function () {
        var defered = q.defer();
        
        generateUsername(defered);

        return defered.promise;
    }
};