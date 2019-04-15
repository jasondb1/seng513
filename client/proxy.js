let HttpsProxyAgent = require('https-proxy-agent');
let proxyConfig = [{
    context: '/api',
    target: 'http://localhost:3000',
    secure: false
}];

function setupForCorporateProxy(proxyConfig) {
    let proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
    if (proxyServer) {
        console.log('Using corporate proxy server:' + proxyServer);
    proxyConfig.forEach(function(entry) {
        entry.agent = agent;
        });
    }
    return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
