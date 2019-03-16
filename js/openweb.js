
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

var contractAbi = [{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"__response","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_admin","type":"address"}],"name":"addDomainAdmin","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"}],"name":"burnPoolTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"}],"name":"buyDomain","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"}],"name":"cancelSellDomain","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"}],"name":"claimHostTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"}],"name":"claimStakeTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"fetchTokenPrice","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"internalTransfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"notifyBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"},{"name":"_amount","type":"uint256"}],"name":"poolDonate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_git","type":"string"},{"name":"_filesHash","type":"bytes32"},{"name":"_file_name","type":"bytes32[]"},{"name":"_file_hash","type":"bytes32[]"}],"name":"publishWebsite","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_ttl","type":"uint256"}],"name":"registerDomain","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_connection","type":"string"}],"name":"registerHost","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_admin","type":"address"}],"name":"removeDomainAdmin","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"}],"name":"renewDomain","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_owner","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_expiry","type":"uint256"}],"name":"sellDomain","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setOwOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hostAddress","type":"address"},{"name":"_amount","type":"uint256"}],"name":"stakeTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_domain","type":"string"},{"name":"_ttl","type":"uint256"}],"name":"updateDomainTTL","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_connection","type":"string"}],"name":"updateHost","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_duration","type":"uint256"}],"name":"userSubscribe","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_cmc","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"name":"_price","type":"uint256"}],"name":"_currentPrice","outputs":[{"name":"_getprice","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_priceFetchingCost","outputs":[{"name":"_getprice","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cmcAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"domain_sale","outputs":[{"name":"owner","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"time","type":"uint256"},{"name":"expity_time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"domainCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"domains","outputs":[{"name":"name","type":"string"},{"name":"admin_index","type":"uint256"},{"name":"total_admins","type":"uint256"},{"name":"git","type":"string"},{"name":"domain_bytes","type":"bytes32"},{"name":"hash","type":"bytes32"},{"name":"total_files","type":"uint256"},{"name":"version","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"time","type":"uint256"},{"name":"expity_time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_domain","type":"string"},{"name":"_file_name","type":"bytes32"}],"name":"getDomainFileHash","outputs":[{"name":"_hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_domain","type":"string"}],"name":"getDomainMeta","outputs":[{"name":"_name","type":"string"},{"name":"_git","type":"string"},{"name":"_domain_bytes","type":"bytes32"},{"name":"_hash","type":"bytes32"},{"name":"_total_admins","type":"uint256"},{"name":"_adminIndex","type":"uint256"},{"name":"_total_files","type":"uint256"},{"name":"_version","type":"uint256"},{"name":"_ttl","type":"uint256"},{"name":"_time","type":"uint256"},{"name":"_expity_time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"}],"name":"getHostTokens","outputs":[{"name":"_amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_year","type":"uint256"},{"name":"_month","type":"uint256"}],"name":"getStakeTokens","outputs":[{"name":"_amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hostAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hostConnection","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"hostConnectionDB","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hostRegistryCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hosts","outputs":[{"name":"id","type":"uint256"},{"name":"hostAddress","type":"address"},{"name":"connection","type":"bytes32"},{"name":"active","type":"bool"},{"name":"start_time","type":"uint256"},{"name":"time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"hostStakes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hostUpdates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hostUpdatesCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPriceUpdate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ow_owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"poolBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"poolBalanceClaimed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publishCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registryDuration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"stakeBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stakeLockTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"stakesLockups","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"stakeTmpBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDomains","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalHosts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"totalStakes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSubscriber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"active","type":"bool"},{"name":"start_time","type":"uint256"},{"name":"expiry_time","type":"uint256"},{"name":"time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"userSurfingCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_domain","type":"string"},{"name":"_file_name","type":"bytes32"},{"name":"_file_hash","type":"bytes32"}],"name":"verifyDomainFileHash","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"websiteFilesLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"websiteSizeLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"websiteUpdates","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"websiteUpdatesCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];



var contractAddress = "0x68fcb1f0d07000a84b569ccb647dd8fe320cddaa";
var tokenAddress = "0xc2494604e9dcefa2a70dcebf81e6d7be064a334e";


var web3 = new Web3('https://mainnet.infura.io/v3/67b5841e21524cc9b6d47bb88f549acb');
var ow = new web3.eth.Contract(contractAbi, contractAddress);



//// vars
var curentCode = {};
var tmp = {};

var parentSign = "";
var _userAddress = '';
var _userPkey = '';
var _reqSignature = '';
var _reqTime = '';

var _localConn = "127.0.0.1:15678";
var _localActive = 0;


var _activeHosts = {};
var _pendingHosts = {};
var activeDBLimit = 20;
var pendingDBLimit = 20;

////


    
//////
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function _parseUrl(url) {
    var match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: url,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5].replace(/^\/|\/$/g, ''),
        search: match[6],
        hash: match[7]
    }
}

function getPath(url) {
    url = url.replace(/^https?:\/\//,'');
    url = url.split('/')[0];
    
    return url;
}

function sortByResponseTime(obj){
	var sortObj={};
	var sortArr=[];
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			sortArr.push([key, obj[key]]);
        }
    }
	
	sortArr.sort(function(a, b){
        return a[1]-b[1];
	});
  
    sortArr.forEach(function(_dt) {
        sortObj[_dt[0]] = _dt[1];
    });
  
	return sortObj;
}

function __trigger_integrityFailed(_tabID, domain){
//    console.log("Failed Integrity on Tab_id: "+_tabID);
    
    if(tmp["_dip_"+domain]){
        let hostI = tmp["_dip_"+domain] - 1;
        
        let iky = "_blk_"+hostI;
        _set({[iky]: 1});
    }
    
    var myNewUrl = chrome.extension.getURL("redirect.html#"+domain);
    chrome.tabs.update(_tabID, {url: myNewUrl});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function timestamp() {
    return Math.floor(Date.now() / 1000);
}

function _set(_data){
    chrome.storage.local.set(_data);
}
    
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function _resetProxy(){
    chrome.proxy.settings.clear(
        {scope: 'regular'},
        function() {}
    );
}

function isPrivateIP(ip) {
   var parts = ip.split('.');
   return parts[0] === '10' || 
      (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
      (parts[0] === '192' && parts[1] === '168') || 
      (parts[0] === '127');
}

function validIPnPort(ip) {
    var parts = ip.split(':');
    var port = parseInt(parts[1]);
    
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(parts[0])) {
        if(port > 0 && port < 65535){
            return true;
        } else{
            return false;
        }
    } else {
        return false;
    }
}

async function httpReq(_ID, url, typ, callback){
    var method = "GET";
    var reqUrl = url;
    if(typ == "ping"){ 
        reqUrl = "http://"+url+"/ping";
        method = "POST"; 
    }
    
    var sendDate = (new Date()).getTime();
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4){
            if(xmlhttp.status==200){
                var receiveDate = (new Date()).getTime();
                var responseTimeMs = receiveDate - sendDate;
                
                var rdata = xmlhttp.responseText;
                
                if(typ == "_varifyIntegrity"){
                    callback(_ID, url, 1, rdata);
                } else if(typ == "ping"){
                    if(isJsonString(rdata)){
                        let jsonDt = JSON.parse(rdata);
                        
                        jsonDt["responseTime"] = responseTimeMs;
                        if(jsonDt["msg"] && jsonDt["msg"] == "pong"){
                            
                            if(_ID == "local"){
                                _localActive = timestamp() + 10;
                            } else {
                                callback(_ID, url, jsonDt);
                            }
                        }
                    }
                }
            } else {
                if(typ == "ping"){
                    if(_ID == "local"){
                        _localActive = 0;
                        _resetProxy();
                    } else {
                        var objInd = conn+"|"+_ID;
                        
                        if(_activeHosts[objInd]){
                            delete _activeHosts[objInd];
                        }
                        
                        if(_pendingHosts[objInd]){
                            delete _pendingHosts[objInd];
                        }
                    }
                }
                
            }
        }
    }
    
    xmlhttp.open(method, reqUrl, false);
    
    if(_userPkey != "" && parentSign != ""){
        var _time = timestamp().toString();
        var sign = web3.eth.accounts.sign(_time, _userPkey).signature;
        
        xmlhttp.setRequestHeader("openweb-requestTime", _time);
        xmlhttp.setRequestHeader("openweb-signature", sign);
        xmlhttp.setRequestHeader("openweb-parantSignature", parentSign);
    }
    
    try {
        xmlhttp.send();
    } catch(e) {
//        console.log(e);
        
        _localActive = 0;
        _resetProxy();
        console.clear();
    }
}

function _varifyIntegrity(_tabID, url, _return, data){
    if(!_return){
        httpReq(_tabID, url, "_varifyIntegrity", _varifyIntegrity);
    } else {
        var _urlMeta = _parseUrl(url);
        var _hash = SHA256(data);
        
        if(_urlMeta.pathname == ""){
            _urlMeta.pathname = "index.html"
        }
        
        _verifyFileHash(_tabID, _urlMeta.host, _urlMeta.pathname, _hash);
    }
}
    
/////


function _balance(_address){
    ow.methods.balanceOf(_address).call(
        function(error, result){
            if (!error) {
                console.log('Balce: ' + result);
            };
        }
    );
}

function _fetchDomainMeta(_domain, _counter){
    var _time = timestamp();
    
    ow.methods.getDomainMeta(_domain).call(
        function(error, result){
            if (!error) {
                var _isgit = 0;
                var _ttl = 0;
                
                if(result._git != ""){
                    _isgit = 1;
                    _ttl = _time + parseInt(result._ttl)
                }
                
                var _dt = {
                    "_etm": parseInt(result._expity_time),
                    "_git": _isgit,
                    "_tfl": parseInt(result._total_files),
                    "_ttl": _ttl
                };
                
                var _key = "_dm_"+_domain;
                _set({[_key]: _dt});
                
                if(_counter == 1){
                    _domainMeta(_domain, _counter);
                }
            };
        }
    );
}

function _domainMeta(_domain, _counter){
    var _key = "_dm_"+_domain;
    chrome.storage.local.get([_key], function(_dt, error) {
        var go = false;
        var _time = timestamp();
        
        if(!isEmpty(_dt)){
            var _vdt = _dt[_key];
            
            if(_vdt._ttl > _time){
                if(_vdt._etm == 0){
                    curentCode[_domain] = 120;  // domain not booked
                } 
                else if(_vdt._etm < _time){
                    curentCode[_domain] = 121;  // domain expired
                } 
                else if(!_vdt._git || !_vdt._tfl){
                    curentCode[_domain] = 122;  // no files
                } else {
                    curentCode[_domain] = 200;
                }
            } else {
//                console.log("recheck");
                if(_counter == 0){
                    go = true;
                } else {
                    if(_vdt._etm == 0){
                        curentCode[_domain] = 120;  // domain not booked
                    } 
                    else if(_vdt._etm < _time){
                        curentCode[_domain] = 121;  // domain expired
                    } 
                    else if(!_vdt._git || !_vdt._tfl){
                        curentCode[_domain] = 122;  // no files
                    } else {
                        curentCode[_domain] = 200;
                    }
                }
            }
        } else {
//            console.log("empty");
            if(!_counter){
                go = true;
            }
        }
        
        if(go){
            _fetchDomainMeta(_domain, 1);
        }
        
//        console.log(curentCode[_domain]);
    });
}


function _verifyFileHash(_tabID, domain, _filename, _hash){
    var _fileNameBytes = web3.utils.fromAscii(_filename);
    var _hashBytes = "0x"+_hash;
    
//    console.log("===>"+ _fileNameBytes, _hashBytes);
    ow.methods.verifyDomainFileHash(domain, _fileNameBytes, _hashBytes).call(
        function(error, result){
            if(!result){
                __trigger_integrityFailed(_tabID, domain);
            }
        }
    );
}


function _fetchHost(){
    ow.methods.totalHosts().call(
        function(error, result){
//            console.log("Total Hosts:"+result);
            var totalHost = parseInt(result);
            
            
            if(totalHost > 0){
                var _key = "_ht";
                
                chrome.storage.local.get([_key], function(_dt, error) {
                    var hostIndex = 0;
                    
                    if(!isEmpty(_dt)){
                        hostIndex = _dt[_key] + 1;
                    }
                    
                    if(hostIndex < totalHost){
                        ow.methods.hostConnection(hostIndex).call(
                            function(error1, result1){
                                var connection = web3.utils.hexToAscii(result1);
//                                console.log("Host Connection:"+connection);
                                
                                if(validIPnPort(connection) && !isPrivateIP(connection)){
                                    var _dt = {
                                        "_cn": connection
                                    };
                                    
                                    var _nkey = "_ht_"+hostIndex;
                                    _set({[_nkey]: _dt});
                                }
                                
                                _set({[_key]: hostIndex});
                            }
                        );
                    }
                });
            }
        }
    );
}


function _fetchHostUpdates(){
    ow.methods.hostUpdatesCounter().call(
        function(error, result){
            var hostUpdateIndex = parseInt(result);
            
            if(hostUpdateIndex > 0){
                var _key = "_htU";
                
                chrome.storage.local.get([_key], function(_dt, error) {
                    var hostUIndex = 0;
                    
                    if(!isEmpty(_dt)){
                        hostUIndex = _dt[_key] + 1;
                    }
                    
                    if(hostUIndex < hostUpdateIndex){
                        ow.methods.hostUpdates(hostUIndex).call(
                            function(error1, hostIndex){
                                
                                ow.methods.hostConnection(hostIndex).call(
                                    function(error2, result1){
                                        var connection = web3.utils.hexToAscii(result1);
//                                        console.log("Host Connection:"+connection);
                                        
                                        var _dt = {
                                            "_cn": 0
                                        };
                                        
                                        if(validIPnPort(connection) && !isPrivateIP(connection)){
                                            _dt["_cn"] = connection;
                                            
                                            
                                            
                                        }
                                        
                                        var _nkey = "_ht_"+hostIndex;
                                        _set({[_nkey]: _dt});
                                        _set({[_key]: hostUIndex});
                                    }
                                );
                            }
                        );
                    }
                });
            }
        }
    );
}


function _hostCallback(hostIndex, conn, rdt){
    var totHwebs = 0;
    if(rdt["total_websites"]){
        totHwebs = rdt["total_websites"];
    }
    
    var objInd = conn+"|"+hostIndex;
    var responsTm = rdt["responseTime"];
    
    
    let added = false;
    if(!_activeHosts[objInd]){ _activeHosts[objInd] = [] ; }

    if(Object.keys(_activeHosts).length < activeDBLimit){
        _activeHosts[objInd] = responsTm;
        added = true;
    }

    if(!added){
        if(!_pendingHosts[objInd]){ _pendingHosts[objInd] = [] ; }

        if(Object.keys(_activeHosts).length < pendingDBLimit){
            _pendingHosts[objInd] = responsTm;
        }
    }
}



function _fetchHostData(){
    var _key = "_ht";
    
    chrome.storage.local.get([_key], function(_dt, error) {
        if(!isEmpty(_dt)){
            let totalHosts = _dt[_key] + 1;
            
//            console.log("--->"+totalHosts);
            
            for(i = 0; i < totalHosts; i++){
                var _time = timestamp();
                var hostIndex = i;
                
                let iky = "_blk_"+hostIndex;
                chrome.storage.local.get([iky], function(_blocked, errorin) {
                    if(isEmpty(_blocked)){
                        if(!tmp["_r_"+hostIndex]){ tmp["_r_"+hostIndex] = 1; }

                        if(tmp["_r_"+hostIndex] < _time){
                            var _hkey = "_ht_"+hostIndex;
                            tmp["_r_"+hostIndex] = _time + 5*60;
                            
                            chrome.storage.local.get([_hkey], function(_dta, error1) {
                                if(!isEmpty(_dta)){
                                    let conn = _dta[_hkey]["_cn"];
                                    conn = conn.replace(/\0/g, '');

                                    if(conn){
                                        httpReq(hostIndex, conn, "ping", _hostCallback);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}


function _syncHosts(){
    let _ahLength = Object.keys(_activeHosts).length;
    let _phLength = Object.keys(_pendingHosts).length;
    var _time = timestamp();
    
    if(_ahLength){
        Object.keys(_activeHosts).forEach(function(objInd) {
            let arrobjInd = objInd.split("|");
            let _conn = arrobjInd[0];
            let _hostIndex = arrobjInd[1];
            
            if(!tmp["_r_"+_hostIndex]){ tmp["_r_"+_hostIndex] = 1; }
            
            if(tmp["_r_"+_hostIndex] < _time){
                httpReq(_hostIndex, _conn, "ping", _hostCallback);
            }
        });
    }
    
    if(_phLength){
        Object.keys(_pendingHosts).forEach(function(objInd) {
            let arrobjInd = objInd.split("|");
            let _conn = arrobjInd[0];
            let _hostIndex = arrobjInd[1];
            if(!tmp["_r_"+_hostIndex]){ tmp["_r_"+_hostIndex] = 1; }
            
            if(tmp["_r_"+_hostIndex] < _time){
                httpReq(_hostIndex, _conn, "ping", _hostCallback);
            }
        });
    }
    
    
    if(_ahLength < activeDBLimit || _phLength < pendingDBLimit){
        _fetchHostData();
    }
    
    _set({"_ahosts": sortByResponseTime(_activeHosts)});
    _set({"_phosts": sortByResponseTime(_pendingHosts)});
}

function _checkLocal(){
    httpReq("local", _localConn, "ping");
}





// --- Init
function _initAddress(){
    var _key = "_uaddr";
    
    chrome.storage.local.get([_key], function(_dt, error) {
        if(isEmpty(_dt)){
            var addrMeata = web3.eth.accounts.create(web3.utils.randomHex(32));
            
            var _dt = {
                "_addr": addrMeata.address,
                "_pkey": addrMeata.privateKey
            };
            
            _userAddress = addrMeata.address;
            _userPkey = addrMeata.privateKey;
            
            
            // ----------------//
            var tmpPkey = "0xbacc05ab5c8f4e2e701fadbca4424b4d63b391194ed34224fc9ba8bed77c5142";
            var taddr = web3.utils.toChecksumAddress(addrMeata.address);
            
            let addrHash = SHA256(taddr);
            var psign = web3.eth.accounts.sign(addrHash, tmpPkey).signature;
            
            _set({"_epSign": psign});
            // ---------------- //
            
            _set({[_key]: _dt});
        } else {
            _userAddress = _dt[_key]._addr;
            _userPkey = _dt[_key]._pkey;
        }
    });
}

function _initpSign(){ 
    chrome.storage.local.get("_epSign", function(_dt, error) {
        if(!isEmpty(_dt)){
            parentSign = _dt["_epSign"];
        }
    });
}



function _loadHostsCache(){
    chrome.storage.local.get("_ahosts", function(_dt, error) {
        if(!isEmpty(_dt)){
            _activeHosts = _dt["_ahosts"];
        }
    });
    
    chrome.storage.local.get("_phosts", function(_dt, error) {
        if(!isEmpty(_dt)){
            _pendingHosts = _dt["_phosts"];
        }
    });
}


function _worker(){
    _fetchHost();
    _fetchHostUpdates();
    
    _syncHosts();
    _checkLocal();
    _initpSign();
    _initAddress();
//    console.log("Alarm Trigger !");
}

function _init(){
    _loadHostsCache();
    _initAddress();
    _loopTrigger();
}



// --- loops
var _loop = '';
function _loopTrigger(){
    clearInterval(_loop);
    _loop = setInterval(_worker, 3000);
}
chrome.alarms.onAlarm.addListener(function() {
    _loopTrigger();
});

chrome.alarms.create({periodInMinutes: 1});
_loopTrigger();
_init();