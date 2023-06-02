<script lang="ts" setup>
import { i18n } from '@/common/plugins/lang';

const languageData = ref([
    {
        name: '简体中文',
        value: 'zh-CN',
    },
    {
        name: 'English',
        value: 'en',
    },
]);

const currentLanguage = computed(() => i18n.global.locale);

const handleLanguageChange = (value: any) => {
    i18n.global.locale = value;
    store.setting().language = value;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('setting.setLanguage')"
            ></top-handle>
            <div class="cover-content _effect">
                <div class="setting-group">
                    <div
                        :key="item.name"
                        @click="handleLanguageChange(item.value)"
                        class="setting-item cursor-pointer"
                        v-for="item in languageData"
                    >
                        <div class="title">{{ item.name }}</div>
                        <i
                            class="el-icon-check row-icon"
                            v-show="item.value as any == currentLanguage"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../assets/css/color.scss';

.setting-group {
    background-color: #fff;
    // border: 1px solid $separate-color;
    // border-width: 1px 0 1px 0;
    // margin-top: 10px;
    // &:first-child{
    //   margin-top: 15px;
    // }
    .setting-item {
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid $separate-color;
        // &:last-child {
        //   border-bottom-width: 0;
        // }
        .title {
            font-size: 16px;
            color: #000;
            padding-left: 10px;
        }
        .row-icon {
            color: $primary-color;
        }
    }
}
</style>
