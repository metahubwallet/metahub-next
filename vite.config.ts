import { setupPlugins } from './config/vite/plugin';
import { alias } from './config/vite/alias';
import { ConfigEnv, loadEnv } from 'vite';
import { parseEnv } from './config/vite/util';
import { css } from './config/vite/css';

export default ({ mode }: ConfigEnv) => {
    const root = process.cwd();
    const env = parseEnv(loadEnv(mode, root));

    return {
        plugins: setupPlugins(),
        resolve: { alias },
        css,
    };
};
