import { RPC } from '@/store/chain/type';
import Chain from './chain';

export default class EOS {
    constructor(private chainId: string, private endpoint: RPC | string, private chain: Chain) {}
}
