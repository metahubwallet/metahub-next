<script lang="ts" setup>
import { theme } from '@/common/util/theme';
const lang = ref([
    {
        name: '简体中文',
        value: 'zh-CN',
    },
    {
        name: 'English',
        value: 'en',
    },
]);
const setting = store.setting();

// 切换语言
const { locale } = useI18n();
const handleChangeLang = async (value: any) => {
    locale.value = value;
    store.setting().setLang(value);
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.setLanguage')"></page-header>

            <div class="cover-content _effect">
                <div class="setting-group">
                    <div
                        :key="item.name"
                        @click="handleChangeLang(item.value)"
                        class="setting-item cursor-pointer"
                        v-for="item in lang"
                    >
                        <div class="title">{{ item.name }} {{ item.value  }}</div>
                        <icon-check v-show="item.value == setting.language" :fill="theme.primaryColor" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.setting-group {
    background-color: #fff;

    .setting-item {
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid $color-separate;
        .title {
            font-size: 16px;
            color: #000;
            padding-left: 10px;
        }
        .row-icon {
            color: $color-primary;
        }
    }
}
</style>
@/common/util/theme