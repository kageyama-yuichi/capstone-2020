//Import key variable wherever stored
const CryptoJS = require("crypto-js");

class Encryption {
    //Encrypt Messages
	encrpyt_message = (value) => {
		return CryptoJS.AES.encrypt(value, "L8Z").toString();
	}
	
	//Decrypt Message
	decrypt_message = (value) => {
		return CryptoJS.AES.decrypt(value, "L8Z").toString(CryptoJS.enc.Utf8);
	}
}

export default new Encryption()