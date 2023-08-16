import { API_URL } from '@/common/constants';
import axios from 'axios';

export const http = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

http.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const {
            response: {
                status,
                data: { message },
            },
        } = error;

        switch (status) {
            // 请求失败
            case 400:
                alert(message);
                break;
            // 请求地址错误
            case 404:
                alert('请求地址不存在');
                break;
            // 表单验证失败
            case 422:
                alert('表单验证失败');
                break;
            // 其它错误
            default:
                alert(message ?? '服务器出现问题，程序员正在努力抢救，请您稍后再试');
        }
        return Promise.reject(error);
    }
);
