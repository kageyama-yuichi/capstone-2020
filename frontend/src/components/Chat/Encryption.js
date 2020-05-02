//Import key variable wherever stored
const CryptoJS = require("crypto-js");

class Encryption {
    //Encrypt Messages
	encrpyt_message = (value) => {
		return CryptoJS.AES.encrypt(value, "L8ZL8ZL8ZL8ZL8Z1").toString();
	}
	
	//Decrypt Message
	decrypt_message = (value) => {
		return CryptoJS.AES.decrypt(value, "L8ZL8ZL8ZL8ZL8Z1").toString(CryptoJS.enc.Utf8);
	}

	/* //Test Encrypt
	test_encrypt = (value) => {
		var cipher = crypto.createCipheriv('AES-128-CBC', "L8Z", '0102030405060708');
		return cipher.update(value, 'utf-8', 'base64') + cipher.final('base64');
	} */
}

export default new Encryption()