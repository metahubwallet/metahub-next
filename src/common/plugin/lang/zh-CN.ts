/*
 * 中文 语言包
 */
/* eslint-disable */
export default {
    // 公共部分
    public: {
        language: '简体中文',
        ok: '确 定',
        cancel: '取 消',
        tip: '提示',
        setLanguage: '语言设置',
        welcome: '欢迎使用 Metahub, 点击导入钱包秘钥,开始您的 EOS 旅程',
        importKey: '导入钱包秘钥',
        noAccountTip: '如果您没有EOS账号，点击这里查看如何注册',
        importKeyTip: '请输入您的钱包密钥',
        importNetTip: '选择网络',
        importAccount: '+ 导入账号',
        importWallet: '导入钱包',
        selectFileToImport: '选择备份文件',
        clearAllAccount: '清空所有账号',
        privateKey: 'EOS密钥',
        invaildPrivateKey: '这不是一个合格的私钥, 请检查是否输错',
        noAccountForPrivateKey: '无法找到与此私钥对应的账号',
        invaildPublicKey: '公钥格式错误',
        settingPasswordTip: '初次使用请设置密码',
        repeatPassword: '再次输入解锁密码',
        password: '请输入解锁密码',
        next: '下一步',
        accountExists: '该账号已经存在.',
        settingPassword: '设置密码',
        finish: '完成',
        passwordLengthTip: '请输入大于6个字符的密码',
        passwordNoSame: '密码前后不一致',
        viewUserProtocols: '查看用户协议',
        readAndAgree: '我已阅读并同意',
        readAndAgreeProtocols: '《服务及隐私条款》',
        donotAgreeProtocolsTip: '请先仔细阅读协议,并勾选',
        requestHttpEndpointTimeout: '请求节点超时，请更换节点或者重试',
        requestServerTimeout: '请求服务器超时',
        resourceCPULimit: '该操作将消耗的CPU资源超出了限制，请抵押足够的CPU资源',
        resourceNetLimit: '该操作将消耗的网络资源超出了限制，请抵押足够的网络资源',
        viewUserProtocolsContent:
            '感谢您选择 Metahub 服务。《 Metahub 服务协议》（以下简称“本协议”）由Metahub和您（以下简称“用户”）签订，本协议在您与Metahub之间具有合同上的法律效力。在本协议中：（1）“我们”和“我们”指代Metahub，“我们的”应据此解释；及（2）“您”指代用户，“您的”应据此解释。您和Metahub单独称为“一方”，合称为“双方”。Metahub在此特别提醒您在使用我们的 Metahub 应用之前，请认真阅读本协议及后文提及的相关协议，尤其是本协议中“免责及责任限制”等以加粗形式体现的条款，确保您充分理解本协议中各条款，并自主考虑风险。',
        voteMax: '最多只能投30个节点',
        noAccount: '无账号',
        noImport: '您没有导入任何账号',
        start: '开始使用',
        setMnemonic: '设置预留信息',
        setMnemonicTip:
            '为了避免钓鱼网站，请设置一些预留信息，如座右铭等。该安全语将会在用户解锁及授权时出现，若不出现或内容不匹配，说明用户登录的可能是钓鱼网站。',
        import: '导入',
        importBackup: '导入备份',
        importErrorTip: '请导入正确的备份文件',
        importErrorTip2: '导入的文件内容被损坏',
        encryptPasswordError: '输入的加密密码错误',
        importBackupSuccess: '导入备份成功',
        executeSuccess: '操作成功',
        executeFailure: '操作失败',
        resourceLimitRam: '该操作将消耗的内存资源超出了限制，请购买足够的内存资源',
        noData: '暂无数据',
        selectAll: '全选',
        welcomeTo: '欢迎来到',
        importAccountNow: '马上导入私钥',
        freeSignup: '没有账号？来免费注册一个',
        parmasError: '参数错误，请勿非法使用钱包！'
    },

    // 资源页面
    resource: {
        resources: '资源',
        cpu: '计算',
        ram: '内存',
        net: '网络',
        used: '已用',
        staked: '已抵押',
        refunding: '赎回中',
        price: '当前价格',
        stake: '抵押',
        unstake: '赎回',
        rent: '租用',
        submit: '确认',
        buy: '购买',
        sell: '出售',
        valueError: '请输入有效数值',
        valueSizeError: '最少要大于15字节',
        stakeSuccess: '操作成功',
        stakeForOthers: '帮人抵押',
        stakeInfo: '抵押详情',
        selfStake: '自己抵押',
        otherStake: '他人抵押',
        stakeReceiver: '接收者',
        amount: '数量',
        unstakeall: '赎回全部',
        noStakeForOthers: '暂无为其他人抵押',
        smoothMode: '顺畅模式',
        estimatedCost: '预计花费',
        transferStake: '转让抵押的费用',
        recharge: '充值',
        remainingNET: '剩余网络',
        freeCPU: '免费CPU',
        tradeREX: '买卖REX',
        rechargeTab1: '0.1 EOS\n100 ms\n大约转账\n350次',
        rechargeTab2: '0.5 EOS\n500 ms\n大约转账\n1750次',
        rechargeTab3: '1.0 EOS\n1000 ms\n大约转账\n3500次',
        rechargeTab4: '3.0 EOS\n3000 ms\n大约转账\n1万次',
        rechargeAccount: '充值账号',
        currentAccount: '自己',
        otherAccount: '他人',
        refundNow: '立刻赎回',
    },
    // 设置页面
    setting: {
        wallet: '钱包',
        resources: '资源',
        application: '应用',
        setting: '设置',
        nodesSetting: '节点选择',
        manageNetworks: '网络管理',
        confirmDelete: '确定删除?',
        confirmRemove: '确定移除?',
        confirmDestroy: '确定销毁钱包中存储的数据吗?',
        confirmPassword: '此操作需要验证您的钱包密码',
        reconfirm: '再次确认',
        manageWallets: '钱包管理',
        setLanguage: '语言设置',
        currentVersion: '当前版本',
        aboutUs: '关于我们',
        alreadyNewestVersion: '已经是最新版本',
        managePermissions: '权限管理',
        exportPrivateKey: '导出私钥',
        clearAbiCache: '清除ABI缓存',
        pingTip: '测试中...',
        defaultNodes: '默认节点',
        delay: '延迟',
        customNodes: '自定义节点',
        inputNodeAddress: '请输入节点地址',
        addNode: '添加自定义节点',
        nodeSelect: '选择节点',
        authorityManage: '权限管理',
        accountName: '账号名',
        currentAccount: '当前账号',
        notice: '注意：',
        ownerNotice: 'Owner：拥有当前 EOS 账号的所有权限。',
        activeNotice: 'Active： 默认情况下，可以完成除更改 Owner 以为的所有交易。',
        securityNotice:
            '为了您的资产安全，建议使用 Active 权限导入钱包日常使用。并妥善保管 Owner 权限对应的私钥。',
        add: '添加',
        remove: '移除',
        modify: '修改',
        showKey: '查看私钥',
        removeTip: '确定删除该公钥?',
        removeWalletTip: '确定从钱包中删除该账号数据吗?',
        changeAuthority: '权限变更',
        newPublicKey: '公钥',
        newPrivateKey: '私钥',
        currentPublicKey: '当前公钥',
        generatePublicKey: '公钥生成器',
        changeNoticeOne: '如果更换的是当前使用的公钥，更换后需要重新用私钥导入钱包才能使用。',
        changeNoticeTwo: '请确认已妥善保管好公钥对应的私钥。',
        submit: '提交变更',
        copy: '复制',
        copySuccess: '复制成功',
        copyFailure: '复制失败',
        removeWallet: '删除钱包',
        useIt: '使用',
        refresh: '刷新',
        enterPublicKeyTip: '请输入想要变更后的公钥',
        generateTipOne: '以上内容不要透露给任何人。',
        generateTipTwo: '建议抄写或者打印私钥后放置在安全地点保存。',
        generateTipThree: '请勿通过网络工具传输私钥。',
        operate: '操作',
        invalidPublicKey: '输入的公钥不合法',
        lockWallets: '锁定钱包',
        exportWallet: '备份钱包',
        destroyWallet: '销毁钱包',
        changePassword: '修改密码',
        oldPassword: '旧密码',
        newPassword1: '新解锁密码',
        newPassword2: '重复解锁密码',
        walletPassowrd: '钱包解锁密码',
        encryptPassword: '加密钱包密码',
        encryptPasswordTip: '加密密码要大于8位且包括字母和数字',
        whitelist: '白名单',
        whiteListCancel: '取消',
        whiteListCancel2: '取消合约',
        whiteListAny: '任意',
        enableNetwork: '启用的网络',
        addExistingNetwork: '添加已知网络',
        addCustomNetwork: '添加自定义网络',
        name: '名称',
        chain: '链',
        operation: '操作',
        sureAddPrefix: '确定要添加"',
        sureAddSuffix: '"网络吗？',
        sureDeletePrefix: '确定要删除"',
        sureDeleteSuffix: '"网络吗？',
        nodeName: '节点名称',
        blockchainFoundation: '底层公链',
        defaultNode: '默认接入点',
        defaultNodeFormatIsIncorrect: '默认接入点格式不正确',
        defaultSymbol: '默认货币',
        defineContractNameAndPrecision: '定义合约名与精度',
        blockchainFoundationIsRequire: '底层公链不能为空',
        contractName: '合约名',
        nameIsRequired: '名称不能为空',
        contractNameRequired: '名称不能为空',
        precisionMustBeAnInteger: '精度必须是整形',
        precisionMustBeBetween: '精度必须在0-8之间',
        chainIdIsRequire: 'ChainId不能为空',
        defaultSymbolIsRequire: '默认货币不能为空',
        symbol: '货币符号',
        precision: '精度',
        lengthMustBe64Characters: '长度必须是64个字符',
        alreadyExist: '相同底层及ChainId的网络已存在',
        alreadyExistNetwork: '同名的网络已存在',
        alreadyExistAccount: '此网络已有账号导入，请先删除账号再操作',
    },

    // 钱包页面
    wallet: {
        assets: '我的资产',
        totalAssets: '全部资产',
        transfer: '转账',
        vote: '投票',
        stake: '抵押',
        receive: '收款',
        detail: '详情',
        balance: '余额',
        website: '官网',
        totalCirculation: '发行总量',
        format: '格式',
        accountInfo: '账号信息',
        copyAccountName: '复制账号名称',
        copied: '已将账号复制到剪贴板',
        paymentAccount: '付款方账号',
        receiverAccount: '收款方账号',
        sender: '付款方',
        receiver: '收款方',
        amount: '付款金额',
        remark: '备注',
        memo: '备注(Memo)',
        symbol: '代币',
        symbols: '代币列表',
        emptyReceiver: '请输入收款方账号',
        errorReceiver: '收款账号格式错误',
        emptyAmount: '请输入金额',
        errorAmount: '请输入正数金额',
        transferSuccess: '转账成功',
        transferSelf: '不能给自己转账',
        accountNotExist: '收款方账号不存在',
        noMoreData: '没有更多数据',
        addNewTokens: '添加新Token',
        searchKeyWord: '搜索代币或者合约',
        contract: '合约',
        voted: '已投票',
        voteSuccess: '投票成功',
        rank: '排名',
        area: '区域',
        transferInfo: '交易详情',
        tradeHistory: '交易记录',
        transation: '交易详情',
        transationHASH: '交易号',
        blockNumber: '区块号',
        transationTime: '交易时间',
        moreDetail: '交易查询',
        nodeVote: '节点投票',
        nodeVoteTip1: '1、在进行投票前，用户需要进行EOS抵押换取投票权。',
        nodeVoteTip2: '2、用户可以在需要的时候取消抵押，并将于72小时后赎回抵押的EOS。',
        importSelectedWallets: '导入选中钱包',
        unknown: '未知',
        setAmount: '设置收款金额',
        all: '全部',
        recentTransfers: '最近转账',
        addMoreTokens: '添加更多Token',
        contractName: '合约名称',
        symbolName: '代币名称',
        required: '必填',
        submit: '提交',
        addTokenSuccessfully: '添加成功',
        addTokenFailed: '未查询到该币种',
        addTokenExist: '此币种已在您的列表中',
        importSuccess: '账号导入成功',
        backupSuccess: '钱包备份成功',
        selectOneAtLeast: '请至少选择一个要导入的账号',
        searchTip: '搜索账号',
    },

    // 钱包密码
    password: {
        submit: '确认',
        cancel: '取消',
        verifyPassword: '密码确认',
        toUnlock: '请输入密码以解锁',
        inputPasswrod: '请输入钱包解锁密码',
        deleteSuccess: '删除成功',
        thisTime: '本次有效',
        one: '1小时内免密',
        six: '6小时内免密',
        close: '关闭应用前免密',
        empty: '密码不能为空',
        error: '密码错误',
        unlock: '解锁',
        welcome: '欢迎您回来!',
        unlockTip: '请输入解锁密码，并注意识别正确的解锁窗口。',
    },

    // 授权
    auth: {
        submit: '确认',
        cancel: '取消',
        authorize: '授权',
        authorizeLogin: '授权登录',
        changeAccount: '切换账号',
        searchAccounts: '搜索账号',
        login: '登录',
        chooseAccount: '选择账号',
        back: '返回',
        loginTip: '网站 {0} 请求授权',
        executionContract: '执行合约',
        requestSignature: '请求签名',
        property: '属性',
        joinWhitelist: '加入白名单',
        canNotAdd: '暂时不支持多个action的白名单',
        whitelistTip:
            '您可以将此操作列入白名单，下次就不必在此确定交易，勾选属性旁边单选框意味着您不限制此项值内容，否则会严格限制。',
    },
    // 应用
    application: {
        myDApps: '我的DApps',
        recommended: '推荐DApps',
        createBosAccount: '创建 BOS 账号',
        publicKey: '公钥',
        privateKey: '私钥',
        publicKeyPlaceholder: '请输入公钥',
        privateKeyPlaceholder: '请输入私钥(选填,用于创建完成自动导入)',
        publicKeyErrorTip: '请输入合法公钥',
        privateKeyErrorTip: '请输入合法私钥',
        accountName: '账号名',
        inviteCode: '获取邀请码',
        accountErrorTip: '支持小写字母 a-z 与数组 12345 组成的 12 位账号名',
        createAccount: '创建账号',
        createSuccessTip: '创建成功',
    },

    error: {
        firstNeedEOS: '这个ETH收款地址第一次被使用，您需要转0.1以上的EOS来激活它。',
        cpuTimeLimit: '顺畅模式CPU时间已耗尽，请充值后再使用',
    },
};
