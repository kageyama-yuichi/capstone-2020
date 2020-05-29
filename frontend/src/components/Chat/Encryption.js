//Import key variable wherever stored
const CryptoJS = require("crypto-js");

var encrypt_key = "L8Z";

class Encryption {
    //Encrypt Messages
	encrpyt_message = (value) => {
		return CryptoJS.AES.encrypt(value, encrypt_key).toString();
	}
	
	//Decrypt Message
	decrypt_message = (value) => {
		return CryptoJS.AES.decrypt(value, encrypt_key).toString(CryptoJS.enc.Utf8);
	}
}

export default new Encryption()