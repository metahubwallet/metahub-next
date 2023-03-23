import { setupPlugins } from './settings/vite/plugins';
import { alias } from './settings/vite/alias';

export default () => {
    return {
        plugins: setupPlugins(),
        resolve: { alias },
    };
};
