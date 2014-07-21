var request = require('request'),
    utils = require('./utils'),
    cap = utils.capitalize,
    q = require('q'),
    wordnik_token = "721d3bfd50df487a1680c0537ca01260c2a0ca2b83ce751fd";

function useIdiom(defered){
    request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=2&maxLength=6&api_key="+ wordnik_token, function (error, res, body) {
        if (error || res.statusCode != 200) {
            defered.reject(error || res.statusCode);
        } else {
            var adjRes = JSON.parse(body);
            request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=idiom&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=15&api_key=" + wordnik_token, function (error, res, body) {
                if (error || res.statusCode != 200) {
                    defered.reject(error || res.statusCode);
                } else {
                    var nounRes = JSON.parse(body);

                    defered.resolve(cap(adjRes.word)+" "+cap(nounRes.word));
                }
            });
        }
    });
}

function useNoun(defered){
    request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=12&api_key="+ wordnik_token, function (error, res, body) {
        if (error || res.statusCode != 200) {
            defered.reject(error || res.statusCode);
        } else {
            var adjRes = JSON.parse(body);
            request("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=" + wordnik_token, function (error, res, body) {
                if (error || res.statusCode != 200) {
                    defered.reject(error || res.statusCode);
                } else {
                    var nounRes = JSON.parse(body);

                    defered.resolve(cap(adjRes.word)+" "+cap(nounRes.word));
                }
            });
        }
    });
}

module.exports = {
    //wraps up the actual logic to query freebase
    //and "build" a random username
    //returns a promise that resolves to a word
    get: function () {
        var defered = q.defer();

        if (Math.random() * (10-1) + 1 > 5)
            useIdiom(defered);
        else
            useNoun(defered);

        return defered.promise;
    }
};