require('dotenv').config()

function getBoolean(str) {
	if(str) {
		if(str.toUpperCase()=='TRUE') {
			return true;
		} else if(str.toUpperCase()=='FALSE') {
			return false;
		} else {
			return str;
		}
	} else {
		return false;
	}
}

module.exports = {
    AUTHURL: process.env.AUTHURL,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    SCOPE: process.env.SCOPE,
    GRANTTYPE: process.env.GRANTTYPE,
    TOKENPATH: process.env.TOKENPATH || '/token/access_token'
}