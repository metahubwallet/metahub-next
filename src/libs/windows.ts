export default class Windows {
    static windowCount: number;
    static windowIds: any;

    static init() {
        this.windowCount = 0;
        this.windowIds = {};
        chrome.windows.onRemoved.addListener((windowId) => {
            this.closeWindow(windowId, { code: -1 });
        });
    }

    static closeWindow(windowId: number, data: { code: number }, forceClose = false) {
        const windowData = this.windowIds[windowId];
        if (windowData) {
            delete this.windowIds[windowId];
            if (forceClose) {
                chrome.windows.remove(windowId);
            }
            chrome.browserAction.setIcon({
                path: '../icons/metahub-128.png',
            });
            if (typeof windowData.callback == 'function') {
                setTimeout(() => windowData.callback(data), 1);
            }
            this.windowCount--;
        }
    }

    static getCount() {
        return this.windowCount;
    }
}

Windows.init();
