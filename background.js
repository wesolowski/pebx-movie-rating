var config = {};

config.addon = {
    "MAP": new Map(),
    "URLS": {"urls": ["http://*/*", "https://*/*"]},
};

config.onBeforeSendHeaders = function (info) {
    let ACRH = info.requestHeaders.find(e => e.name.toLowerCase() === "access-control-request-headers");
    if (ACRH) config.addon.MAP.set(info.requestId, ACRH.value);
};

config.onHeadersReceived = function (info) {
    let ACAOM = info.responseHeaders.filter(e => e.name.toLowerCase() !== 'access-control-allow-origin' && e.name.toLowerCase() !== 'access-control-allow-methods');
    ACAOM.push({'name': 'Access-Control-Allow-Origin','value': '*'});
    ACAOM.push({'name': 'Access-Control-Allow-Methods', 'value': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'});

    if (config.addon.MAP.has(info.requestId)) {
        ACAOM.push({'name':'Access-Control-Allow-Headers', 'value': config.addon.MAP.get(info.requestId)});
        config.addon.MAP.delete(info.requestId);
    }

    return {"responseHeaders": ACAOM};
};




var app = {};

app.version = function () {return chrome.runtime.getManifest().version};
app.homepage = function () {return chrome.runtime.getManifest().homepage_url};
app.tab = {"open": function (url) {chrome.tabs.create({"url": url, "active": true})}};

app.webRequest = function () {
    console.log('config:',config);
    console.log('chrome:',chrome);
    console.log('chrome.webRequest:',chrome.webRequest);
    console.log('chrome.webRequest.onHeadersReceived:',chrome.webRequest.onHeadersReceived);
    var onHeadersReceived = chrome.webRequest.onHeadersReceived.hasListener(config.onHeadersReceived);
    var onBeforeSendHeaders = chrome.webRequest.onBeforeSendHeaders.hasListener(config.onBeforeSendHeaders);
    /*  */
    if (onHeadersReceived) chrome.webRequest.onHeadersReceived.removeListener(config.onHeadersReceived, config.addon.URLS, ["blocking", "responseHeaders"]);
    if (onBeforeSendHeaders) chrome.webRequest.onBeforeSendHeaders.removeListener(config.onBeforeSendHeaders, config.addon.URLS, ["blocking", "requestHeaders"]);
    /*  */

    chrome.webRequest.onHeadersReceived.addListener(config.onHeadersReceived, config.addon.URLS, ["blocking", "responseHeaders"]);
    chrome.webRequest.onBeforeSendHeaders.addListener(config.onBeforeSendHeaders, config.addon.URLS, ["blocking", "requestHeaders"]);

};

app.webRequest();
