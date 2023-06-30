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
            <page-header :title="$t('setting.setting')"></page-header>

            <div class="cover-content _effect">
                <div class="setting-group">
                    <!-- select network -->
                    <div
                        @click="$router.push({ name: 'network-select', query: { type: 'node' } })"
                        class="setting-item"
                    >
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_node_select@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.nodesSetting') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>

                    <!-- wallet manage  -->
                    <div @click="$router.push({ name: 'wallet-manage' })" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_wallet@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.manageWallets') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <!-- whitelist -->
                    <div @click="$router.push({ name: 'whitelist' })" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_whitelist@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.whitelist') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>

                    <!-- network manage -->
                    <div @click="$router.push({ name: 'network-manage' })" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_network_select@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.manageNetworks') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <!-- set language -->
                    <div @click="$router.push({ name: 'setting-language' })" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_language@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('public.setLanguage') }}</div>
                            <div class="item-subtitle">{{ $t('public.language') }}</div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>

                    <!-- current version -->
                    <div class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_refresh@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.currentVersion') }}</div>
                            <div class="item-subtitle">{{ currentVersion }}</div>
                        </div>
                    </div>

                    <!-- about us -->
                    <div @click="aboutUs" class="setting-item">
                        <div class="setting-icon">
                            <img class="img-icon" src="@/asset/img/setting_about_me@2x.png" />
                        </div>
                        <div class="setting-main">
                            <div class="item-title">{{ $t('setting.aboutUs') }}</div>
                            <div class="item-subtitle"></div>
                            <img class="img-icon" src="@/asset/img/right_arrow@2x.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.setting-group {
    padding: 0;
    background-color: #fff;
    .setting-item {
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        cursor: pointer;
        border-bottom: 1px solid $color-separate;

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
