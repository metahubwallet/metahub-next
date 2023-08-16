const contentJsUrl = chrome.runtime.getURL('/src/entries/contentScript/content.js');
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', contentJsUrl);
console.log(document.head || document.body || document.documentElement);
(document.head || document.body || document.documentElement).appendChild(script);
script.onload = () => script.remove();

document.addEventListener('chromeMessageRequest', (event: any) => {
    const data = event.detail;
    //console.log('on chromeMessageRequest');
    const message = data.msg;
    //console.log(message);
    chrome.runtime.sendMessage(message, (response) => {
      //console.log('chrome.runtime callabck');
      //console.log(response);
      document.dispatchEvent(new CustomEvent("chromeMessageResponse", {detail: {id: data.id, response: response}}));
    });
});