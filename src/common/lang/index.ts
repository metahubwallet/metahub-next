import { createI18n } from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh-CN';

const messages = {
    // 中文简体包
    'zh-CN': zhLocale,
    // 英文包
    en: enLocale,
};

export const i18n = createI18n({
    messages,
    globalInjection: true, //全局生效$t
    locale: store.setting().language || 'zh-CN',
});
