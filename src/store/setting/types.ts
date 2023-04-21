export interface SettingState {
    language: LangugeType; // 界面语言
    isLock: boolean; // 是否锁定界面
}

export type LangugeType = 'zh-CN' | 'en';
