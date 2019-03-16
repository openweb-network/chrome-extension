(function() {
    window.sendMsg = function(msg){
        chrome.runtime.sendMessage(msg);
    }
    
    function onMsg(msg){
        console.log(msg);
    }
    
    chrome.runtime.onMessage.addListener(onMsg);
})();

$( document ).ready(function() {
    var symbol = "OWT";
    var manifest = chrome.runtime.getManifest();
    var web3 = new Web3('https://mainnet.infura.io/v3/67b5841e21524cc9b6d47bb88f549acb');
    
    
    let erc20Address = "0xc2494604e9dcefa2a70dcebf81e6d7be064a334e";
    let owContract = "0x68fcb1f0d07000a84b569ccb647dd8fe320cddaa";
    var _uAddress = "";
    
    let erc20ABI = [{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}];
    
    let erc20 = new web3.eth.Contract(erc20ABI, erc20Address);
    let ow = new web3.eth.Contract(erc20ABI, owContract);
    
    
    
    function _set(_data){
        chrome.storage.local.set(_data, function(){
            if(_data._epSign){
                sendMsg({"action": "_initpSign"});
            }
        });
    }
    
    function _remove(_data){
        chrome.storage.local.remove(_data, function(){
            if(_data == "_epSign"){
                sendMsg({"action": "_initpSign"});
            }
        });
    }
    
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    
    function SHA256(s){
         var chrsz  = 8;
         var hexcase = 0;
         function safe_add (x, y) {
         var lsw = (x & 0xFFFF) + (y & 0xFFFF);
         var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
         return (msw << 16) | (lsw & 0xFFFF);
         }
         function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
         function R (X, n) { return ( X >>> n ); }
         function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
         function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
         function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
         function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
         function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
         function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
         function core_sha256 (m, l) {
         var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
         var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
         var W = new Array(64);
         var a, b, c, d, e, f, g, h, i, j;
         var T1, T2;
         m[l >> 5] |= 0x80 << (24 - l % 32);
         m[((l + 64 >> 9) << 4) + 15] = l;
         for ( var i = 0; i<m.length; i+=16 ) {
         a = HASH[0];
         b = HASH[1];
         c = HASH[2];
         d = HASH[3];
         e = HASH[4];
         f = HASH[5];
         g = HASH[6];
         h = HASH[7];
         for ( var j = 0; j<64; j++) {
         if (j < 16) W[j] = m[j + i];
         else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
         T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
         T2 = safe_add(Sigma0256(a), Maj(a, b, c));
         h = g;
         g = f;
         f = e;
         e = safe_add(d, T1);
         d = c;
         c = b;
         b = a;
         a = safe_add(T1, T2);
         }
         HASH[0] = safe_add(a, HASH[0]);
         HASH[1] = safe_add(b, HASH[1]);
         HASH[2] = safe_add(c, HASH[2]);
         HASH[3] = safe_add(d, HASH[3]);
         HASH[4] = safe_add(e, HASH[4]);
         HASH[5] = safe_add(f, HASH[5]);
         HASH[6] = safe_add(g, HASH[6]);
         HASH[7] = safe_add(h, HASH[7]);
         }
         return HASH;
         }
         function str2binb (str) {
         var bin = Array();
         var mask = (1 << chrsz) - 1;
         for(var i = 0; i < str.length * chrsz; i += chrsz) {
         bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
         }
         return bin;
         }
         function Utf8Encode(string) {
         string = string.replace(/\r\n/g,"\n");
         var utftext = "";
         for (var n = 0; n < string.length; n++) {
         var c = string.charCodeAt(n);
         if (c < 128) {
         utftext += String.fromCharCode(c);
         }
         else if((c > 127) && (c < 2048)) {
         utftext += String.fromCharCode((c >> 6) | 192);
         utftext += String.fromCharCode((c & 63) | 128);
         }
         else {
         utftext += String.fromCharCode((c >> 12) | 224);
         utftext += String.fromCharCode(((c >> 6) & 63) | 128);
         utftext += String.fromCharCode((c & 63) | 128);
         }
         }
         return utftext;
         }
         function binb2hex (binarray) {
         var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
         var str = "";
         for(var i = 0; i < binarray.length * 4; i++) {
         str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
         hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
         }
         return str;
         }
         s = Utf8Encode(s);
         return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    }
    
    function _loadAddr(_address){
        $("._address").text(_address);
        _updSHAmsg();
        
        ow.methods.balanceOf(_address).call(
            function(error, result){
                if (!error) {
                    var amt = web3.utils.fromWei(result, "ether");
                    amt = Math.round(amt);
                    
                    $("._cBal").html("<b>"+amt+"</b> "+symbol);
                };
            }
        );
        
        erc20.methods.balanceOf(_address).call(
            function(error, result){
                if (!error) {
                    var amt = web3.utils.fromWei(result, "ether");
                    amt = Math.round(amt);
                    
                    $("._tBal").html("<b>"+amt+"</b> "+symbol);
                };
            }
        );
    }
    
    $("._back").click(function(){
        $("._allpage").hide();
        $("._mainPg").show();
    });
    
    $("._changeAddr").click(function(){
        $("._allpage").hide();
        $("._addrPg").show();
        
        $("#address").val('');
        _remove("_eAddr");
    });
    
    $("._changeSign").click(function(){
        $("._allpage").hide();
        $("._psignPg").show();
        
        $("#signature").val('');
    });
    
    $("#addrSet").click(function(){
        var addr = $("#address").val();
        $("#address").css("border-color", "#e1e8ed");
        
        if(web3.utils.isAddress(addr)){
            addr = web3.utils.toChecksumAddress(addr);
            _uAddress = addr;
            _set({"_eAddr": addr});
            
            $("._cBal").val("<b>-</b> "+symbol);
            $("._tBal").val("<b>-</b> "+symbol);
            
            $("._allpage").hide();
            $("._mainPg").show();
            _loadAddr(addr);
        } else {
            $("#address").css("border-color", "red");
        }
    });
    
    $("#signSet").click(function(){
        $("._parentSign").text("");
        _remove("_epSign");
        
        var sign = $("#signature").val();
        $("#signature").css("border-color", "#e1e8ed");
        
        let addrHash = $(".__msgdt").text();
        
        let signAddr = web3.eth.accounts.recover(addrHash, sign);
        signAddr = web3.utils.toChecksumAddress(signAddr);
        
        if(signAddr && signAddr == _uAddress){
            $("._parentSign").text(sign);

            $("._allpage").hide();
            $("._mainPg").show();

            _set({"_epSign": sign});
        } else {
            $("#signature").css("border-color", "red");
        }
    });
    
    function _checkSign(){
        chrome.storage.local.get("_epSign", function(_dt, error) {
            if(!isEmpty(_dt)){
                var _psign = _dt["_epSign"];
                
                $("._parentSign").text(_psign);
            }
        });
    }
    
    function _updSHAmsg(){
        chrome.storage.local.get("_uaddr", function(_dt, error) {
            if(!isEmpty(_dt)){
                let _userAddress = _dt["_uaddr"]._addr;
                _userAddress = web3.utils.toChecksumAddress(_userAddress);
                let addrHash = SHA256(_userAddress);
                
                $(".__msgdt").text(addrHash);
            }
        });
    }
    
    function _checkAddress(){
        chrome.storage.local.get("_eAddr", function(_dt, error) {
            if(!isEmpty(_dt)){
                _uAddress = _dt["_eAddr"];
                _loadAddr(_uAddress);
                
                $("._allpage").hide();
                $("._mainPg").show();
            }
        });
        
        _updSHAmsg();
    }
    
    
    function init(){
        $(".__version").text("v"+manifest.version);
        
        $("._cBal").val("<b>-</b> "+symbol);
        $("._tBal").val("<b>-</b> "+symbol);
        
        _checkAddress();
        _checkSign()
    }
    
    init()
});