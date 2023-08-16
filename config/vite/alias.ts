import path from 'path';
import { AliasOptions } from 'vite';

export const alias: AliasOptions = {
    '@': path.resolve(__dirname, '../../src'),
    'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
    'moment': 'dayjs'
};
