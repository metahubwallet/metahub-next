import { setupPlugins } from './config/vite/plugin';
import { alias } from './config/vite/alias';
import { ConfigEnv, loadEnv } from 'vite';
import { parseEnv } from './config/vite/util';

export default ({ mode }: ConfigEnv) => {
    const root = process.cwd();
    const env = parseEnv(loadEnv(mode, root));
    console.log(`Currently in a ${env.VITE_ENV} environment`);

    return {
        plugins: setupPlugins(),
        resolve: { alias },
    };
};
