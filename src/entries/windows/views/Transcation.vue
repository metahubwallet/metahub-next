<script setup lang="ts">
import { md5 } from '@/common/util/crypto';
import { Auth } from '@/types/account';
import { WhiteItem } from '@/types/settings';
import { Action } from 'eosjs/dist/eosjs-serialize';
import _ from 'lodash';

interface Payload {
    domain: string;
    chainId: string;
    actions: Action[];
    dataKeys: string[][];
    encryptText: '';
    authorization: Auth;
    buffer: Buffer;
}

const { t } = useI18n();

const payload: Payload = reactive({
    domain: '',
    chainId: '',
    actions: [],
    dataKeys: [],
    authorization: { actor: '', permission: '' },
    encryptText: '',
    buffer: Buffer.from([]),
});

const checked = ref(false);
const actionsChecked: string[] = reactive([]);
const type = ref('transcation');
const tabs: string[] = reactive([]);
const actionsJson: string[] = reactive([]);
const loading = ref(false);

watch(checked, (nv, _ov) => {
    if (nv) {
      if (payload.actions.length > 1) {
        console.log(payload.actions)
        // console.log(whitelist);
        window.msg.warning(t('auth.canNotAdd'));
        checked.value = false
      }
    }
});

onMounted(async () => {
    console.log('mounted');
    const { windowParams } = await chrome.storage.session.get(['windowParams']);
    console.log(windowParams);
    if (windowParams && windowParams.domain && windowParams.chainId) {
        Object.assign(payload, windowParams);
    } else {
        window.msg.warning(t('public.parmasError'));
        return;
    }

    if (payload.encryptText) {
        type.value = 'signature';
    } else {
        for (const act of payload.actions) {
            tabs.push('property');
            actionsJson.push(JSON.stringify(act.data, null, '    '));
        }
        // console.log(tabs);

        // only one
        if (payload.actions.length == 1) {
            for (let key in payload.actions[0].data) {
                actionsChecked.push(key);
            }
        }
    }


});

const onSubmit = async () => {
    loading.value = true;
    // console.log(actions)
    // console.log(whitelist.value)
    const whitelist = [] as WhiteItem[];
    if (type.value == 'transcation' && checked.value) {
        for (const action of payload.actions) {
            console.log(actionsChecked);
            const properties = _.cloneDeep(payload.actions[0].data);
            actionsChecked.forEach((x) => (properties[x] = '*'));
            const item: WhiteItem = {
                domain: payload.domain,
                chainId: payload.chainId,
                contract: action.account,
                action: action.name,
                actor: payload.authorization.actor,
                permission: payload.authorization.permission,
                properties: properties,
                hash: '',
            };
            item.hash = md5([item.domain, item.chainId, item.actor, item.permission, item.contract, item.action].join('-'));
            whitelist.push(item);
        }
        // console.log(whitelist);
    }
    
    // save result
    await chrome.storage.session.set({ windowResult: { approve: true, whitelist } });

    window.close();
};

const onShowChange = async (index: number, tab: string) => {
    //tabs.value[index] = tab;
    // console.log(index, tab);
    //this.$set('tabs', index, tab);
    tabs.splice(index, 1, tab);
};

const onClose = async () => {
    window.close();
};
</script>

<template>
    <div class="app-window">
        <div class="header">
            <div class="title">{{ type == 'transcation' ? $t('auth.executionContract') : $t('auth.requestSignature') }}</div>
            <div class="authorization">
                <div class="authorization-name">{{ payload.authorization.actor + '@' + payload.authorization.permission }}</div>
                <div class="domain">{{ payload.domain }}</div>
            </div>
        </div>

        <div class="content-transcation" v-if="type == 'transcation'">
            <n-scrollbar>
                <div :key="index" class="content-action" v-for="(action, index) in payload.actions">
                    <div class="content-action-name">
                        <div class="content-action-name-left">
                            <span>{{ action.account }} → {{ action.name }}</span>
                            <span></span>
                        </div>
                        <div class="content-action-name-right">
                            <div
                                :class="{ active: tabs[index] == 'property' }"
                                @click="onShowChange(index, 'property')"
                                class="content-action-tab content-action-tab-property"
                            >
                                {{ $t('auth.property') }}
                            </div>
                            <div :class="{ active: tabs[index] == 'json' }" @click="onShowChange(index, 'json')" class="content-action-tab content-action-tab-json">
                                JSON
                            </div>
                        </div>
                    </div>

                    <div class="content-action-data" v-if="tabs[index] == 'property'">
                        <n-checkbox-group v-model="actionsChecked" class="checkbox-group">
                            <div :key="'cadc-' + key" class="content-action-data-cell" v-for="key in payload.dataKeys[index]">
                                <div class="content-action-data-left">
                                    <n-checkbox :label="key" :value="key" v-if="checked" class="action-label"></n-checkbox>
                                    <span v-if="!checked">{{ key }}</span>
                                </div>
                                <div class="content-action-data-right">{{ action.data[key] }}</div>
                            </div>
                        </n-checkbox-group>
                    </div>
                    <div class="content-action-data content-action-json" v-if="tabs[index] == 'json'">
                        <pre>{{ actionsJson[index] }}</pre>
                    </div>
                </div>
            </n-scrollbar>
        </div>
        <div class="content-signature" v-if="type == 'signature'">
            <div class="content-signature-text">{{ payload.encryptText }}</div>
        </div>

        <div class="whitelist" v-if="payload.actions.length">
            <div class="check"><n-checkbox v-model:checked="checked">{{ $t('auth.joinWhitelist') }}</n-checkbox></div>
            <div class="tip" v-if="payload.actions.length">{{ $t('auth.whitelistTip') }}</div>
        </div>
        
        <div class="btns">
            <n-button @click="onClose" class="trx-btn">{{ $t('auth.cancel') }}</n-button>
            <n-button :loading="loading" @click="onSubmit" class="trx-btn trx-btn2">{{ $t('auth.submit') }}</n-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.app-window {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    overflow: hidden;
    .header {
        font-size: 18px;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        padding: 30px 20px 10px 20px;
        background-image: linear-gradient(rgba(246, 221, 255, 0.8), rgba(225, 225, 250, 0.05));
        flex-basis: 110px;
        .title {
            flex-grow: 1;
            color: #222;
            font-size: 22px;
            line-height: 24px;
            font-weight: bold;
        }
        .authorization {
            margin-top: 25px;
            line-height: 21px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .authorization-name {
                font-size: 14px;
                color: #222;
            }
            .payload.domain {
                color: #222;
                font-size: 14px;
            }
        }
    }

    .content-transcation {
        flex-basis: 0;
        flex-grow: 1;
        font-family: Helvetica, Arial;
        overflow: hidden;
        .content-action {
            padding: 0 20px;
            width: 100%;
            overflow: hidden;
            &:last-child {
                margin-bottom: 10px;
            }
            .content-action-name {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: #222;
                padding: 18px 0;
                .content-action-name-left {
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    span {
                        height: 30px;
                        display: block;
                        padding: 0 5px 0 14px;
                        background-image: url('@/assets/images/trx-action1.png');
                        background-size: auto 30px;
                    }
                    span:last-child {
                        padding: 0;
                        width: 9px;
                        height: 30px;
                        background-image: url('@/assets/images/trx-action2.png');
                        background-size: 9px 30px;
                    }
                }
                .content-action-name-right {
                    width: 150px;
                    height: 26px;
                    font-size: 12px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    background: #f8f8f8;
                    border-radius: 14px;
                    .content-action-tab {
                        width: 75px;
                        height: 100%;
                        text-align: center;
                        line-height: 26px;
                        color: $color-primary;
                        cursor: pointer;
                        font-weight: 500;
                    }
                    .content-action-tab.active {
                        background: linear-gradient(140deg, #da00f2 0%, #bf01fa 100%, #bf01fa 100%);
                        color: white;
                        border-radius: 14px;
                    }
                }
            }

            .content-action-data {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                background: #fcfcfc;
                box-shadow: 0px 1px 4px 0px rgba(108, 10, 88, 0.06);
                border-radius: 12px;
                border: 1px solid #d2d2d2;
                padding: 15px;
                font-size: 12px;
                overflow: hidden auto;

                &.content-action-json {
                    padding: 10px 15px;
                    overflow: hidden;
                    color: #666;
                    pre {
                        font-family: Consolas, Mono, Menlo, Helvetica, Arial;
                        display: block;
                        width: 100%;
                        font-size: 12px;
                        word-break: break-all;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        line-height: 20px;
                    }
                }

                .checkbox-group {
                    width: 100%;
                }

                .content-action-data-cell {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                    line-height: 24px;
                    margin-bottom: 6px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .content-action-data-left {
                        min-width: 75px;
                        color: #222;
                        font-weight: bold;
                    }
                    .content-action-data-right {
                        width: 100px;
                        padding-left: 20px;
                        flex-grow: 1;
                        color: #222;
                        word-break: break-all;
                    }
                }
            }
        }
    }

    .content-signature {
        flex: 1;
        padding: 20px 20px 10px 20px;
        width: 100%;
        overflow: hidden;
        .content-signature-text {
            background: #f2f2f2;
            border-radius: 4px;
            padding: 20px;
        }
    }

    .whitelist {
        padding: 0 20px;
        
        .check {
            height: 34px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;
            color: #4a4a4a;
            font-weight: 400;
        }
        .tip {
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            color: #888;
            word-wrap: break-word;
            text-align: left;
        }
    }

    .btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-basis: 100px;
        .trx-btn {
            border: 1px solid $color-primary;
            border-radius: 4px;
            box-shadow: 0px 1px 4px 0px rgba(210, 0, 244, 0.09);
            border-radius: 33px;
            font-weight: 500;
            width: 116px;
            font-size: 14px;
            color: $color-primary;
        }
        .trx-btn2 {
            background: linear-gradient(140deg, #da00f2 0%, #bf01fa 100%, #bf01fa 100%);
            box-shadow: 0px 1px 4px 0px rgba(210, 0, 244, 0.09);
            border-radius: 33px;
            color: #fff;
            margin-left: 20px;
        }
    }
}
</style>
