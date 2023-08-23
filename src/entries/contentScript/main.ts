const contentJsUrl = chrome.runtime.getURL('/src/entries/contentScript/content.js');
const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', contentJsUrl);
(document.head || document.body || document.documentElement).appendChild(script);
script.onload = () => script.remove();

document.addEventListener('chromeMessageRequest', (event: any) => {
    const data = event.detail;
    chrome.runtime.sendMessage(data.msg, (response) => {
        document.dispatchEvent(new CustomEvent('chromeMessageResponse', { detail: { id: data.id, response: response } }));
    });
});
