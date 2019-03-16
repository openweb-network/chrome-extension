(function() {
    const tabStorage = {};
    const urls = [
        "*://*.ow/*"
    ];
    const networkFilters = {
        urls: urls
//        types: ["main_frame"]
    };
    const networkFilters1 = {
        urls: urls,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"] 
    };
    
    const ResourceType = ["blocking"];

    chrome.webRequest.onBeforeRequest.addListener(returnFunc, networkFilters, ResourceType);

    
    
    function returnFunc(details, counter){
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        
        tabStorage[tabId].requests[requestId] = {
            requestId: requestId,
            url: details.url,
            startTime: details.timeStamp,
            status: 'pending'
        };
        
        
        if(details.type == "main_frame"){
            var _domain = _parseUrl(details.url).host;
            
            if(counter != 1){
                _domainMeta(_domain, 0);
            }
            
            if(curentCode[_domain] == 200){
                if(_localActive){
                    _processProxy(_domain, _localConn);
                } else {
                    let activeConn = Object.keys(_activeHosts).length;
                    if(activeConn){
                        let connIndex = getRandom(0, (activeConn-1));
                        let connDtArr = (Object.keys(_activeHosts)[connIndex]).split("|");
                        let connDt = connDtArr[0];
                        
                        if(!tmp["_dip_"+_domain]){ tmp["_dip_"+_domain] = 0; }
                        tmp["_dip_"+_domain] = connIndex + 1;
                        
                        console.log("connect proxy:"+connDt);
                        _processProxy(_domain, connDt);
                    }
                }
            } else {
                
                if(curentCode[_domain] >= 100){
                    console.log("error:"+curentCode[_domain]);
                    return {cancel: true};
                } else {
                    return {redirectUrl: chrome.extension.getURL("redirect.html#"+details.url)};
                }
            }
        }
    }
    
    

    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        const { tabId, requestId } = details;
        
        if(_userPkey != ''){
            var _time = timestamp().toString();
            var sign = web3.eth.accounts.sign(_time, _userPkey).signature;
            
            details.requestHeaders.push(
                { name: "openweb-requestTime", value: _time },
                { name: "openweb-signature", value: sign },
                { name: "openweb-parantSignature", value: parentSign }
            );
        }
        
        return {requestHeaders: details.requestHeaders};
        
    }, { urls: urls }, ["blocking", "requestHeaders"]);
    
    chrome.webRequest.onCompleted.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];

        Object.assign(request, {
            endTime: details.timeStamp,
            requestDuration: details.timeStamp - request.startTime,
            status: 'complete'
        });
        
//        console.log(tabStorage[tabId].requests[details.requestId]);
//        console.log(details);
        
        if(!details.fromCache){
            _varifyIntegrity(tabId, details.url, 0);
        }
        
    }, networkFilters1, ["responseHeaders"]);

    chrome.webRequest.onErrorOccurred.addListener((details)=> {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }
        
        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,           
            status: 'error',
        });
//        console.log(tabStorage[tabId].requests[requestId]);
        
    }, networkFilters);
    
    
    
    // -----
    chrome.tabs.onActivated.addListener((tab) => {
        const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
        if (!tabStorage.hasOwnProperty(tabId)) {
            tabStorage[tabId] = {
                id: tabId,
                requests: {},
                registerTime: new Date().getTime()
            };
        }
    });
    
    chrome.tabs.onRemoved.addListener((tab) => {
        const tabId = tab.tabId;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        tabStorage[tabId] = null;
    });
    
    
    
    function _processProxy(url, conn){
        var config = {
            mode: "pac_script",
            pacScript: {
              data: "function FindProxyForURL(url, host) {\n" +
                "  if (host == '"+url+"')\n" +
                "    return 'PROXY "+conn+"';\n" +
                "  return 'DIRECT';\n" +
                "}"
            }
        };
        chrome.proxy.settings.set(
            {value: config, scope: 'regular'},
            function() {}
        );
    }
    
    
    
    // here we receive the coming message from the content script page
    chrome.runtime.onMessage.addListener(function( request, sender, sendResponse ) {
        console.log(request);
        
        if(request.action == "_initpSign"){
            _initpSign();
        }
    });
    
    
    function sendMsg(msg){
        chrome.runtime.sendMessage(msg);
    }
    
}());