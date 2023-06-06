module.exports = {
    extends: ['@commitlint/config-conventional'],
    // 校验规则
    rules: {
        'type-enum': [
            2,
            'always',
            [
                "feat", // 新功能
                "fix", // 修改bug
                "alter", // 调整代码
                "wrap", // 封装代码
                "style", // 页码样式
                "config", // 配置
                "chore", // 琐碎操作
                "docs", // 更新文档
                "test", // 测试
                "build", // 打包
            ],
        ],
        'type-case': [0],
        'type-empty': [0],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 72],
    },
}