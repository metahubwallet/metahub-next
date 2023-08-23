<script setup lang="ts">
// import { indexOf } from '../config/mnemonic';
import { eosChainId } from '@/common/util/network';
const briefAccount = tool.briefAccount;

const word = ref('-');

const payload = reactive({ domain: '', chainId: '' });
const chainId = ref('');
const accounts = ref([] as any);

// computed
// allAccounts: function() {
//   let accounts = this.$store.state.wallets.filter( x => x.chainId == this.chainId );
//   // console.log(this.$store.state.wallets);
//   accounts.map(x => {
//     x.permissions = x.keys.flatMap(y => y.permissions);
//     x.permission = x.permissions[0];
//     return x;
//   });
//   // console.log(accounts);
//   return accounts;
// }

// watch:
// word(m, o) {
//   if (m !== o) {
//     this.accounts = this.allAccounts.filter(account => {
//       return account.account.includes(this.word);
//     });
//   }
// }

// this.windows = chrome.extension.getBackgroundPage().background.windows;

onMounted(() => {
    // this.payload = await this.windows.getParams();

    word.value = '';
    chainId.value = payload.chainId;
});

const changePermision = ({ account, permission } : { account: any, permission: any })  => {
    account.permission = permission;
    let idx = accounts.indexOf(account);
    if (idx >= 0) {
        accounts[idx] = account;
    }
};

const login = (walletAccount: any) => {
    let publicKey = '';
    const permission = walletAccount.permission;
    for (const key of walletAccount.keys) {
        if (key.permissions.indexOf(permission) >= 0) {
            publicKey = key.publicKey;
        }
    }
    if (!publicKey) {
        alert('key error');
        return;
    }
    const account = {
        name: walletAccount.name,
        publicKey: publicKey,
        authority: permission,
        chainId: chainId.value,
    };

    // console.log(account);
    // this.windows.returnMessage(account);
    //console.log(account.name);
};
</script>

<template>
    <div class="window">
        <!-- <TitleBar  :height="20"></TitleBar> -->
        <div class="header">
            <div class="title">{{ $t('auth.authorizeLogin') }}</div>
            <!-- <p>{{$t('auth.loginTip', [payload.domain])}}</p> -->
            <div class="domain">{{ payload.domain }}</div>
        </div>

        <div class="search-bar">
            <div class="search-input">
                <i class="n-icon-search"></i>
                <input :placeholder="$t('auth.searchAccounts')" prefix-icon="n-icon-search" v-model="word" />
            </div>
        </div>

        <n-scrollbar>
            <ul class="accounts">
                <li v-for="account in accounts" :key="account.name">
                    <div class="account-name">
                        <h3>{{ briefAccount(account.account, 12, 10) }}</h3>
                        <n-popover trigger="click" placement="bottom">
                            <template #trigger>
                                <span class="n-dropdown-link">
                                    {{ account.permission }}
                                    <i class="n-icon-arrow-down n-icon--right"></i>
                                </span>
                            </template>
                            <div :key="item" v-for="item in account.permissions"  @click="changePermision({ account, permission: item })">{{ item }}</div>
                        </n-popover>
                    </div>
                    <n-button @click="login(account)" class="select-botton" type="primary">{{ $t('auth.login') }}</n-button>
                </li>
                <li v-if="accounts.length === 0" class="no-account">
                    <img class="no-account-img" src="@/asset/img/no_account.png" />
                    <div class="no-account-tip">{{ $t('public.noImport') }}</div>
                </li>
            </ul>
        </n-scrollbar>
    </div>
</template>

<style lang="scss" scoped>
.window {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
        font-size: 18px;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        padding: 30px 20px 10px 20px;
        background-image: linear-gradient(rgba(246, 221, 255, 0.8), rgba(225, 225, 250, 0.05));
        .title {
            flex-grow: 1;
            color: #222;
            font-size: 22px;
            line-height: 24px;
            font-weight: bold;
        }
        .domain {
            margin-top: 25px;
            line-height: 21px;
            font-size: 14px;
            color: #222;
        }
    }
    .search-bar {
        padding: 10px 20px;
        margin-bottom: 8px;
        display: flex;
        flex-direction: row;
        justify-content: right;
        .search-input {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 160px;
            background: #f3f3f3;
            border-radius: 14px;
            padding: 5px 10px;
            input {
                margin-left: 10px;
                outline: 0;
                font-size: 14px;
                line-height: 20px;
                flex-grow: 1;
                background: transparent;
                border: 0;
                &::placeholder {
                    color: #bbb;
                }
            }
        }
    }
    .n-scrollbar {
        flex-grow: 1;
        font-size: 14px;
        color: #7f7f7f;
        .accounts {
            padding: 0 20px 20px 20px;
            li {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 71px;
                margin-bottom: 10px;
                padding: 0 20px;
                box-shadow: 0px 1px 3px 0px rgba(255, 66, 216, 0.11);
                border-radius: 12px;
                background-color: rgba(252, 252, 252, 0.4);
                border: 1px solid #dbdbdb;
                .account-name {
                    line-height: 1.2em;

                    h3 {
                        color: $color-primary;
                        font-size: 15px;
                        font-weight: bold;
                    }
                    .permission {
                        margin-top: 5px;
                        font-size: 13px;
                        color: #888;
                        cursor: pointer;
                    }
                }
                .select-botton {
                    font-size: 12px;
                    background: linear-gradient(140deg, #da00f2 0%, #bf01fa 100%, #bf01fa 100%);
                    border-radius: 16px;
                    font-weight: 200;
                    padding: 8px 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    border-color: transparent;
                }
            }
            .no-account {
                height: 380px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .no-account-img {
                    width: 150px;
                }
                .no-account-tip {
                    margin-top: 25px;
                    color: #999;
                }
            }
        }
    }
}

// /deep/ .n-scrollbar {
//   height: 100%;
//   .n-scrollbar__wrap {
//     overflow-x: hidden;
//   }
//   .n-scrollbar__bar.is-horizontal {
//     display: none;
//   }
// }
.n-icon-arrow-down {
    font-size: 12px;
}
</style>
