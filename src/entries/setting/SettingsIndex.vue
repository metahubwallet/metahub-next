<script setup lang="ts">
const currentVersion = ref('v1.0.0');

onBeforeMount(() => {
    let manifestData = chrome.runtime.getManifest();
    currentVersion.value = manifestData.version;
});

const aboutUs = () => {
    chrome.tabs.create({ url: 'https://metahub.cash/' }); // 新标签页跳转
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" :title="$t('setting.setting')"></top-handle>
            <div class="cover-content _effect">
                <!-- 节点选择 -->
                <div class="setting-group">
                    <div
                        @click="$router.push({ path: '/blockchains', query: { type: 'node' } })"
                        class="setting-item"
                    >
                        <div class="setting-icon">
                            <img
                                class="img-icon"
                                src="@/assets/images/setting_node_select@2x.png"
                            />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.nodesSetting') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>
                    <!-- 钱包管理 -->
                    <div
                        @click="
                            $router.push({
                                path: '/wallets',
                            })
                        "
                        class="setting-item"
                    >
                        <div class="setting-icon">
                            <img class="img-icon" src="@/assets/images/setting_wallet@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.manageWallets') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <!-- 白名单管理 -->
                    <div
                        @click="
                            $router.push({
                                path: '/whitelist',
                            })
                        "
                        class="setting-item"
                    >
                        <div class="setting-icon">
                            <img class="img-icon" src="@/assets/images/setting_whitelist@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.whitelist') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>

                    <div
                        @click="
                            $router.push({
                                path: '/network',
                            })
                        "
                        class="setting-item"
                    >
                        <div class="setting-icon">
                            <img
                                class="img-icon"
                                src="@/assets/images/setting_network_select@2x.png"
                            />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.manageNetworks') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <div @click="$router.push('/language')" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/assets/images/setting_language@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('public.setLanguage') }}</div>
                            <div class="item-subtitle">{{ $t('public.language') }}</div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>
                    <!-- 当前版本 -->
                    <div class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/assets/images/setting_refresh@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.currentVersion') }}</div>
                            <div class="item-subtitle">{{ currentVersion }}</div>
                        </div>
                    </div>
                    <!-- 关于我们 -->
                    <div @click="aboutUs" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/assets/images/setting_about_me@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.aboutUs') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/color.scss';

.setting-group {
    padding: 0;
    // margin-top: 10px;
    background-color: #fff;
    // border-bottom: 1px solid $separate-color;

    .setting-item {
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        cursor: pointer;
        border-bottom: 1px solid $separate-color;

        // &:last-child .setting-main {
        //   border-bottom-width: 0;
        // }

        .setting-icon {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 50px;
            padding: 0 15px;
            img {
                width: auto;
                height: 18px;
            }
        }
        .setting-main {
            padding-right: 15px;
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            // border-bottom: 1px solid $separate-color;
            img {
                width: 7.5px;
                height: auto;
            }
        }

        .item-title {
            margin-right: auto;
            margin-left: 2px;
            font-size: 16px;
            color: #222;
            justify-self: flex-start;
        }
        .item-subtitle {
            font-size: 13px;
            color: #888;
            margin-right: 10px;
        }
    }
}
</style>
