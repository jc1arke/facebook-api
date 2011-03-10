var querystring = require('querystring');
var https = require('https');
var URL = require('url');

function raw(method, path, params, callback) {
    var facebook_graph_url = 'https://graph.facebook.com';
    path = path[0] == '/' ? path: '/' + path;
    var url = joinUrl(facebook_graph_url + path, params);
    doRequest(method, url, callback);
};

function doRequest(method, url, callback) {
    var parsedUrl = URL.parse(url, true);
    var result = '';

    var options = {
        host: parsedUrl.host,
        port: parsedUrl.protocol == 'https:' ? 443: 80,
        path: joinUrl(parsedUrl.pathname, parsedUrl.query),
        method: method
    };

    var req = https.request(options,
    function(res) {
        res.on('data',
        function(chunk) {
            result += chunk;
        });
        res.on('end',
        function() {
            if (res.statusCode !== 200) {
                callback({
                    statusCode: res.statusCode,
                    data: result
                },
                null);
            } else {
                callback(null, JSON.parse(result));
            }
        });
    });
    req.end();
};

function joinUrl(path, params) {
    return path + "?" + querystring.stringify(params);
}

if (typeof module == "object" && typeof require == "function") {
    module.exports = raw;
}