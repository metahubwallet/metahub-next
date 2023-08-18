export default class Windows {
    static windowCount: number;
    static windowParams: { [key: number]: { resolve: Function, params: any } };

    static init() {
        this.windowCount = 0;
        this.windowParams = {};
        chrome.windows.onRemoved.addListener((windowId) => {
            this.closeWindow(windowId, { code: -1 });
        });
    }

    static closeWindow(windowId: number, data: { code: number }, forceClose = false) {
        const windowParam = this.windowParams[windowId];
        if (windowParam) {
            delete this.windowParams[windowId];
            if (forceClose) {
                chrome.windows.remove(windowId);
            }
            if (typeof windowParam.resolve == 'function') {
                setTimeout(() => windowParam.resolve(data), 1);
            }
            this.windowCount--;
        }
    }

    static getCount() {
        return this.windowCount;
    }

    static async createWindow(type: string, width: number, height: number, params: any) {
        return new Promise(async (resolve) => {
            const cw = await chrome.windows.getCurrent();
            const display = await chrome.system.display.getInfo();
            const screen = display[0].bounds;
            const win = await chrome.windows.create(
                {
                    url: 'src/entries/windows/index.html#/' + type,
                    focused: true,
                    width: width,
                    height: height,
                    left: Math.round((screen.width - width) / 2),
                    top: Math.round((screen.height * 0.8 - height) / 2),
                    type: 'popup',
                }
            );
            this.windowCount++;
            this.windowParams[win.id!] = { resolve, params };
        })
    };
}

Windows.init();
