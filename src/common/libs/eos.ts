import Chain from './chain';

export default class EOS {
    constructor(private chainId: string, private endpoint: string, private chain: Chain) {}
}
