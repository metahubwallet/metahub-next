
interface Data {
  id: number;
  response: string;
}

export default class MessageCenter {
  static msgId: number = 0;
  static msgMap = new Map<number, (response: string) => void>();

  static watch() {
    document.addEventListener('chromeMessageResponse', (event: any) => {
      const data: Data = event.detail;
      const callback = this.msgMap.get(data.id);
      this.msgMap.delete(data.id);
      callback!(data.response);
    });
  }

  static send(msg: any, callback: (response: string) => void) {
    let msgId = ++this.msgId;
    this.msgMap.set(msgId, callback);
    document.dispatchEvent(new CustomEvent("chromeMessageRequest", {detail: {id: msgId, msg: JSON.stringify(msg)}}));
  }

}

MessageCenter.watch();