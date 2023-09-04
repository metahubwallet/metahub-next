import { App } from 'vue';
import { createI18n } from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh-CN';

const messages = {
    // 中文简体包
    'zh-CN': zhLocale,
    // 英文包
    en: enLocale,
};

const defaultLang = chrome && chrome.i18n ? chrome.i18n.getUILanguage() : 'en';

export const i18n = createI18n({
    messages,
    legacy: false,
    globalInjection: true, // 全局生效$t
    locale: (await localCache.get('language', defaultLang)) + '',
});

export const setupI18n = async (app: App) => {
    app.use(i18n);
};
