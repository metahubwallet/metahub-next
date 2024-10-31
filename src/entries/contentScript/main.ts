// const documentElement = document.head || document.documentElement;
// if (documentElement) {
//     const contentJsUrl = chrome.runtime.getURL('/src/entries/contentScript/content.js');
//     const script = document.createElement('script');
//     script.setAttribute('type', 'module');
//     script.setAttribute('src', contentJsUrl);
//     script.onload = () => script.remove();
//     documentElement.appendChild(script);

// }

document.addEventListener('chromeMessageRequest', (event: any) => {
  var data = event.detail;  var message = data.msg;
  chrome.runtime.sendMessage(message, (response) => {
    document.dispatchEvent(new CustomEvent("chromeMessageResponse", {detail: {id: data.id, response: response}}));
  });
});
