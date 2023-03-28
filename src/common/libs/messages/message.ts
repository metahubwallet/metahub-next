import MessageCenter from './messageCenter';

const strippedHost = () => {
  let host = location.hostname;

  // Replacing www. only if the domain starts with it.
  if(host.indexOf('www.') === 0) host = host.replace('www.', '');

  return host;
};

export class Playload {
  domain: string;
  data?: string;

  constructor() {
    this.domain = '';
  }
}

export class Message {
  type: string;
  payload: Playload;

  constructor() {
    this.type = '';
    this.payload = new Playload();
  }

  static placeholder() { return new Message(); }
  static fromJson(json: Object) { return Object.assign(this.placeholder(), json); }

  static payload(type: string, payload: Playload) {
    let p = this.placeholder();
    p.type = type;
    p.payload = payload;
    return p;
  }

  static signal(type: string) {
    let p = this.placeholder();
    p.type = type;
    return p;
  }

  request() {
    const msg = this;
    if (!msg.payload.domain) {
      msg.payload.domain = strippedHost();
    }
    return new Promise((resolve, reject) => {
      MessageCenter.send(msg, (response: any) => {
        resolve(response)
      });
    });
    
  }

  
}
