//Node.js core modules & essential Modules.
var sha1 = require('sha1');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');
var path = require("path");
var fs = require("fs");
var sha256 = require("sha256");
var aes256 = require('aes256');


//option Area.
//default Param Keys.
var ENCRYPT_SEC_KEY = 'enCryptSecKey';
var ENCRYPT_SEC_KEY_HASH = 'enCryptSecKeyHash';
var ENCRYPT_MESSAGE = 'message';

var DECRYPT_SEC_KEY = 'enCryptSecKey';
var DECRYPT_SEC_KEY_HASH = 'enCryptSecKeyHash';
var DECRYPT_MESSAGE = 'message';

//AES key.
var secretKey;
 

var hybridCrypto = {
    /**     
     * 
     * @param message {String} ur passing messages.
     * @param pubKeyPath {String} ur publicKey path like ./pubKeys, must pem.
     * @param key {String} optional. when ur Session still not ending using this param.
     */
    EncryptMessage :function(messages,pubKeyPath,key){

         if (typeof messages !== 'string' || !messages) {
            throw new TypeError(' messages must be a non-empty string');
          }
        
        if(key==undefined){
            secretKey = makeRandomKey();
        }else{
            secretKey = key;
        }
        
        var enCryptedSecreketKey = enCryptedRSA(secretKey,pubKeyPath);
        var enCryptedSecreketKeyHash = enCryptedRSA(sha256(secretKey),pubKeyPath)
    
        var enCryptedAES =  aes256.encrypt(secretKey,messages);
        var HashMap = new Object();
        HashMap[ENCRYPT_SEC_KEY]=enCryptedSecreketKey;
        HashMap[ENCRYPT_SEC_KEY_HASH]=enCryptedSecreketKeyHash;
        HashMap[ENCRYPT_MESSAGE] = enCryptedAES;
        return HashMap;
    },
    /**
     * DecryptMessage
     * @param data {String} ur received All Messages maybe Json type.
     * @param privKey path {String} ur privateKey Path liek ./priKeys, must pem.
     */
    DecryptMessage : function(data,privKeyPath){
       if (!data) {
            throw new TypeError(' messages must be a non-empty string');
        }
        var enCryptSecKey = data[DECRYPT_SEC_KEY];
        var enCryptSecKeyHash = data[DECRYPT_SEC_KEY_HASH];
        var dataMessage = data[DECRYPT_MESSAGE];

        var deCryptedSecretKey = deCryptedRSA(enCryptSecKey,privKeyPath);
        var deCryptedSecretKeyHash = deCryptedRSA(enCryptSecKeyHash,privKeyPath);
        
        if(deCryptedSecretKeyHash==sha256(deCryptedSecretKey)){
            var deCryptedAES = aes256.decrypt(deCryptedSecretKey,dataMessage);
            return deCryptedAES;
        }else{
           throw new HashError(' secretKeyHash Value Not Equel');
        }

    }


 };

/**
 * optional.
 * saving ur key.
 * @param key {String} for aes Key.
 */
function HybridCipher(key){
  if (typeof key !== 'string' || !key) {
    throw new TypeError(' key must be a non-empty string');
  }
  Object.defineProperty(this,'key',{value:key});
}
/**
 * optional.
 * u can use ur keeping key.
 * ex)your key during ur Session.
 * @param key {String} mean aesKey
 */
hybridCrypto.hasKey = function(key){
    // console.log('hasKey');
    //위에 하이퍼사이퍼 정의된곳으로이동 및 프로퍼티 전체 추가 key
    return new HybridCipher(key);
};

HybridCipher.prototype.EncryptMessage = function(message,pubKeyPath,key){
    return hybridCrypto.EncryptMessage(message,pubKeyPath,this.key);
};


/**
 * optional.
 * u can change ur last Data params Key.
 */
hybridCrypto.paramENCRYPT_SEC_KEY = function(pKey){
    ENCRYPT_SEC_KEY=pKey
};
hybridCrypto.paramENCRYPT_SEC_KEY_HASH = function(pKey){
    ENCRYPT_SEC_KEY_HASH=pKey
};
hybridCrypto.paramENCRYPT_MESSAGE = function(pKey){
    ENCRYPT_MESSAGE=pKey
};
hybridCrypto.paramDECRYPT_SEC_KEY = function(pKey){
    DECRYPT_SEC_KEY=pKey
};
hybridCrypto.paramDECRYPT_SEC_KEY_HASH = function(pKey){
    DECRYPT_SEC_KEY_HASH=pKey
};
hybridCrypto.paramDECRYPT_MESSAGE = function(pKey){
    DECRYPT_MESSAGE=pKey
};
/**
 * Rsa Algorithem
 * @param  text {String} 
 * @param  publicKeyPath {String}
 * @return {String} result.
 */
function enCryptedRSA(text,publicKeyPath){
  var absolutePath = path.resolve(publicKeyPath);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(text);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};
/**
 * Rsa Algorithem
 * @param  encryptedText {String} 
 * @param  privateKeyPath {String}
 * @return {String} result.
 */
function deCryptedRSA(encryptedText,privateKeyPath){
  var absolutePath = path.resolve(privateKeyPath);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(encryptedText, "base64");
    var decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8")

};

/**
 * just Generate Random Key.
 * using time & randomIDs
 * @return {String}
 */
function makeRandomKey(){
    var randomKey =  sha1(new Date().getTime()+makeID());
    return randomKey;

};
/**
 * optional.
 * u can saving ur secretkey. 
 * like a Session.
 * @return {String}
 */
hybridCrypto.getSecretKey =function(){
    return secretKey;
};


function makeID()
{
    var text = "";
    var possible = "0123456789qwertyuiopasdfghjklzxcvbnm";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
module.exports = hybridCrypto;
