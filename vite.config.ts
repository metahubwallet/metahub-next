import { setupPlugins } from './settings/vite/plugins';
import { alias } from './settings/vite/alias';
import { ConfigEnv, loadEnv } from 'vite';
import { parseEnv } from './settings/vite/utils';

export default ({ mode }: ConfigEnv) => {
    const root = process.cwd();
    const env = parseEnv(loadEnv(mode, root));
    console.log(`Currently in a ${env.VITE_ENV} environment`);

    return {
        plugins: setupPlugins(),
        resolve: { alias },
    };
};
