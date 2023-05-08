<script setup lang="ts">
import QRCode from 'qrcode';
import { briefAccount } from '@/common/utils/tools';

let canvas: any = '';

const format = ref('TekenPocket');
const symbol = ref(store.user().currentSymbol);
const contract = ref('eosio.token');
const amount = ref('');
let network = reactive({} as any);
const isCopied = ref(false);

const route = useRoute();

onMounted(() => {
    network = store.chain().findNetwork(store.chain().currentChainId);
    symbol.value = route.query.symbol ? route.query.symbol : store.user().currentSymbol;

    contract.value = route.query.contract ? route.query.contract + '' : 'eosio.token';
    // 生成二维码
    draw();
});

const clip = (value: string) => {
    window.clip(value);
};

const { currentWallet: account } = store.user();
const draw = () => {
    canvas = document.getElementById('qrccode-canvas');
    let to = account.name;
    let memo = '';
    if (account.account > 12) {
        to = 'etheraccount';
        memo = account.account;
    }

    let data = {
        protocol: 'ScanProtocol',
        action: 'transfer',
        address: to, // 转账目标地址
        contract: contract, // 可选，可以指定token，也可以由钱包扫码后自行选择转帐token，需要与字段symbol、precision保持匹配
        symbol: symbol.value, // 可选，可以指定token，也可以由钱包扫码后自行选择转帐token，需要与字段contract、precision保持匹配
        precision: 4, // 可选，可以指定token，也可以由钱包扫码后自行选择转帐token，需要与字段contract、symbol保持匹配
        blockchain: network.chain.toUpperCase(), // BTC, ETH, EOS, BOS, MEET.ONE
        amount: amount.value == '' ? '0' : amount.value, // 可选  真实转账数量
        memo, // 可选 备注信息
    };
    QRCode.toCanvas(
        canvas,
        JSON.stringify(data),
        { errorCorrectionLevel: 'M', scale: 6, width: 210, margin: 1 },
        (error: any) => {
            if (error) {
                console.log(error);
            } else {
                canvas = document.getElementById('qrccode-canvas');
            }
        }
    );
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" :title="$t('wallet.receive')"></top-handle>
            <div class="cover-content _effect">
                <div class="full">
                    <div class="coin-other">
                        <div class="coin-other1">
                            {{ network.name }} {{ $t('wallet.accountInfo') }}
                        </div>
                        <div class="coin-other2" @click="clip(account.account)">
                            {{ briefAccount(account.account, 10, 8) }}
                            <img
                                v-if="!isCopied"
                                @click="$event.stopPropagation()"
                                class="account-cell-key-copy"
                                src="../../assets/images/account_copy2.png"
                            />
                            <span v-else>Copied!</span>
                        </div>
                        <div class="coin-other3">
                            <canvas class="qrcode_box" id="qrccode-canvas"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.full {
    .token-count-tip {
        font-size: 18px;
        margin-left: 12px;
        color: #ffffff;
        letter-spacing: 0;
    }

    .coin-picker {
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-right: 20px;
    }

    .coin-other {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .coin-other1 {
        margin-bottom: 9px;
        font-size: 14px;
        color: #7f7f7f;
        letter-spacing: 0;
    }
    .coin-other2 {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        font-size: 14px;
        color: #222;
        letter-spacing: 0;
        img {
            width: 14px;
            height: 14px;
            margin-left: 5px;
            cursor: pointer;
        }
        span {
            margin-left: 10px;
            color: #888;
        }
    }
    .coin-other3 {
        margin-bottom: 30px;
        height: 210px;
        width: 210px;
    }
    .coin-other4 {
        margin-bottom: 50px;
        height: 40px;
        width: 210px;
        font-size: 16px;
        // color: #4a8fe2;
        // letter-spacing: 0;
        text-align: center;
    }
    .copy {
        height: 44px;
        width: 210px;
    }
    .coin-other-input {
        margin-bottom: 15px;
        height: 40px;
        width: 210px;
    }
}
</style>
