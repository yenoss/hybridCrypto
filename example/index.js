var http = require('http');
var hybridCrypto = require('../lib/hybridCrypto/hybridCrypto');

http.createServer().listen(53370, function() {

    //enCrypt
    //Sender...
    //01
    // u have a key? then using that!! 
    // var cipher = hybridCrypto.hasKey('test');

    // change return param Key
    // paramENCRYPT_SEC_KEY_HASH,paramENCRYPT_MESSAGE
    // hybridCrypto.paramENCRYPT_SEC_KEY('bb'); 
    //
    // var data = cipher.EncryptMessage('message','./keyspub');

    // 02 
    // optional.
    // change return param Key
    // paramENCRYPT_SEC_KEY_HASH,paramENCRYPT_MESSAGE
    // hybridCrypto.paramENCRYPT_SEC_KEY('bb'); 
    // 
    var plainText = "===== just message,json===="
    hybridCrypto.paramENCRYPT_SEC_KEY('key');
    hybridCrypto.paramENCRYPT_SEC_KEY_HASH('hash'); 
    hybridCrypto.paramENCRYPT_MESSAGE('message'); 
    var senderData= hybridCrypto.EncryptMessage(plainText,'./keyspub');

    console.log('plainText ==> ',plainText);
    console.log('sender encrypted Data => ',senderData);
    


    //Decrypt
    ////...mayb beReceiver
    // u must matching return param Key!!!
    // paramDECRYPT_SEC_KEY_HASH,paramDECRYPT_MESSAGE
    // hybridCrypto.paramDECRYPT_SEC_KEY('bb'); 
    // 
    // 
    // 
    hybridCrypto.paramDECRYPT_SEC_KEY('key');
    hybridCrypto.paramDECRYPT_SEC_KEY_HASH('hash'); 
    hybridCrypto.paramDECRYPT_MESSAGE('message'); 
    var receiverData = hybridCrypto.DecryptMessage(senderData,'./keyspri');
    console.log('receiver decrypted Data =>',receiverData);

});
