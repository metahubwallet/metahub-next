import type { GlobalThemeOverrides } from 'naive-ui';

export const theme = {
    primaryColor: '#bf01fa',
};


export const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: theme.primaryColor,
        primaryColorHover: theme.primaryColor,
        primaryColorPressed: theme.primaryColor,
    },
    Button: {
        colorDisabledPrimary: theme.primaryColor,
    },
};
