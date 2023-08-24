import { WhiteItem } from "@/types/settings";

export interface SettingState {
    language: 'zh-CN' | 'en'; // 界面语言
    whitelist: WhiteItem[];
}
