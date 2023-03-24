import * as yup from 'yup';

// 定义提示信息
yup.setLocale({
    mixed: {
        required: '${label}不能为空',
    },
    string: {
        email: '邮箱格式错误',
        min: '${label}长度不能少于 ${min} 位',
        max: '${label}长度不能大于 ${max} 位',
    },
    number: {
        min: '${label}不能少于 ${min}',
        max: '${label}不能大于 ${max}',
    },
});

export default yup;
