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
            chrome.action.setIcon({
                path: '../../static/metahub-128.png',
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

    static createWindow(type: string, width: number, height: number, params: any, callback: Function) {
        chrome.windows.create(
            {
                url: 'pages/window.html#/' + type,
                width: width,
                height: height,
                left: Math.round((screen.width - width) / 2),
                top: Math.round((screen.height * 0.8 - height) / 2),
                type: 'popup',
            },
            (window: any) => {
                this.windowCount++;
                chrome.action.setIcon({
                    path: '../../static/metahub-open.png',
                });
                this.windowIds[window.id] = { callback, params };
            }
        );
    }
}

Windows.init();
