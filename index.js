const crypto = require('crypto');
const fs = require('fs');
const tls = require('tls');
var url = require('url');
var https = require('https');
const config = require('./config');

var authenticate = function(refresh_token) {
    let securecontext = tls.createSecureContext({
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
    });

    let authurl = url.parse(config.AUTHURL);
    let port = 443;
    if(authurl.port) {
        port = authurl.port;
    }

    //console.log(authurl.host);

    let options = {
        host: authurl.host,
        port: port,
        rejectUnauthorized: false,
        secureContext: securecontext,
        path: authurl.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = {
        "client_id": config.CLIENTID,
        "client_secret": config.CLIENTSECRET
    }

    if(refresh_token) {
        body.grant_type = 'refresh_token';
        body.refresh_token = refresh_token;
    } else {
        body.client_secret = config.CLIENTSECRET;
        body.grant_type = config.GRANTTYPE;
        body.scope = config.SCOPE;
    }

    httpRequest({ options: options, body: body }, function(err, resp) {
        if(err) {
            callback("Error connecting to " +  authurl.host + ': ' + err, false);
        } else {
            body = JSON.parse(resp.body);
            console.log(new Date() + ' writing token to ' + config.TOKENPATH);
            fs.writeFile(config.TOKENPATH, body.access_token, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    setTimeout(function() {
                        authenticate(body.refresh_token);
                    }, (body.expires_in - 60) * 1000);
                    return;
                }
            });
        }
    });
}

var httpRequest = function(params, callback) {
    let body = '';
    if(params.hasOwnProperty('body')) {
        if(typeof params.body == 'string') {
            body = params.body;
        } else {
            body = JSON.stringify(params.body);
        }
    }
    
    if(params.options.method=='POST') {
        params.options.headers['Content-Length'] = Buffer.byteLength(body)
    }

    const req = https.request(params.options, res => {
        var resp = [];
        res.on('data', function(data) {
            resp.push(data);
        });

        res.on('end', function() {
            callback(false, {statusCode: res.statusCode, options: params.options, headers: res.headers, body: Buffer.concat(resp).toString()});
        });
    })

    req.on('error', function(err) {
        //console.log(err.toString());
        callback(err.toString(), {statusCode: false, options: params.options, headers: false, body: JSON.stringify({ error: err.toString()})});
    })

    if(params.options.method=='POST') {
        req.write(body);
    }

    req.end()
}

authenticate();