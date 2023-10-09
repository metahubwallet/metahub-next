/*
 * English language Pack
 */
/* eslint-disable */

export default {
    public: {
        // common part
        language: 'English',
        ok: 'OK',
        cancel: 'Cancel',
        tip: 'Tip',
        setLanguage: 'Language',
        welcome: 'Welcome to Metahub, import your private key, start your EOS journey.',
        importKey: 'Import pravite key',
        noAccountTip: "If you don't have private key, clicked here!",
        importKeyTip: 'Import your account private key',
        importNetTip: 'Choose Network',
        importAccount: '+ Import Account',
        importWallet: 'Import Wallet',
        selectFileToImport: 'Select backup file to import',
        privateKey: 'EOS private key',
        invaildPrivateKey: 'Invaild private key',
        noAccountForPrivateKey: 'Not found any accounts for this private key',
        invaildPublicKey: 'Invaild public key',
        settingPasswordTip: 'Setting your password',
        repeatPassword: 'Repeat password',
        password: 'Wallet Password',
        next: 'Next',
        clearAllAccount: 'clear All Account',
        accountExists: 'The account already exists.',
        settingPassword: 'Setting',
        finish: 'Finish',
        passwordLengthTip: 'Password min length is 6',
        passwordNoSame: 'Password is not the same',
        viewUserProtocols: 'View user protocols',
        readAndAgree: 'I have read and agree with',
        readAndAgreeProtocols: 'Service & Privacy Policy',
        donotAgreeProtocolsTip: 'Please carefully read and agree with protocols.',
        requestHttpEndpointTimeout: 'Request timeout, Please replace the node or try again',
        requestServerTimeout: 'Request server timeout',
        resourceCPULimit: 'Insufficient CPU resources, please stake CPU and try again',
        resourceNetLimit: 'Insufficient Net resources, please stake Net and try again',
        viewUserProtocolsContent:
            'Thanks for choosing Metahub service. Service agreement between Metahub  and you (hereinafter referred to as "the user"), the Metahub service agreement (hereinafter referred to as "the agreement") is entered into by and between Metahub. and you (hereinafter referred to as "the user"). In this agreement :(1) "we" and "we" mean Metahub and "ours" shall be construed accordingly; And (2) "you" means the user and "yours" shall be construed accordingly. You and Metahub are individually referred to as "one party" and collectively as "both parties". Metahub hereby specially reminds you that before using Metahub app, please carefully read this agreement and the relevant agreements mentioned in the following paragraphs, especially the terms of "disclaimer and limitation of liability" and other terms in bold form in this agreement, so as to ensure that you fully understand the terms of this agreement and consider the risks independently.',
        voteMax: 'Can only select up to 30',
        noAccount: 'No account',
        noImport: 'You have not imported any accounts yet',
        start: 'Start using',
        setMnemonic: 'Set reservation information',
        setMnemonicTip:
            'In order to avoid phishing websites, please set some reservation information, such as motto. The security language will appear when the user unlocks and authorizes. If it does not appear or the content does not match, the user may log in to the phishing website.',
        import: 'Import',
        importBackup: 'Import backup',
        importErrorTip: 'Please import the correct backup file',
        importErrorTip2: 'The contents of the imported file are corrupted',
        encryptPasswordError: 'Encrypt passowrd error',
        importBackupSuccess: 'Import backup successfully',
        executeSuccess: 'Operation successfully',
        executeFailure: 'Operation failure',
        resourceLimitRam: 'Account using more than allotted RAM usage',
        noData: 'No data',
        selectAll: 'All',
        welcomeTo: 'Welcome to',
        importAccountNow: 'Import key now',
        freeSignup: 'No account? Signup one for free!',
        parmasError: 'Parameter error, do not use the wallet illegally!'
    },

    // 资源页面
    resource: {
        resources: 'Resources',
        cpu: 'CPU',
        ram: 'RAM',
        net: 'NET',
        used: 'Used',
        staked: 'Staked',
        refunding: 'Refunding',
        price: 'Price',
        stake: 'Stake',
        unstake: 'Unstake',
        rent: 'Rent',
        submit: 'Submit',
        buy: 'Buy',
        sell: 'Sell',
        valueError: 'Please enter a valid value',
        valueSizeError: 'At least 15 bytes',
        stakeSuccess: 'Successful!',
        stakeForOthers: 'For others',
        stakeInfo: 'Stake Info',
        selfStake: 'SelfStake',
        otherStake: 'Other Stake',
        stakeReceiver: 'Receiver',
        amount: 'Amount',
        unstakeall: 'Unstake all',
        noStakeForOthers: 'No stakes for others',
        smoothMode: 'Smooth Mode',
        estimatedCost: 'Estimated Cost',
        transferStake: 'Transfer stake to account',
        recharge: 'Recharge',
        remainingNET: 'Remaining',
        freeCPU: 'Free CPU',
        tradeREX: 'Trade REX',
        rechargeTab1: '0.1 EOS\n100 ms\n350 transfers estimated',
        rechargeTab2: '0.5 EOS\n500 ms\n1750 transfers estimated',
        rechargeTab3: '1.0 EOS\n1000 ms\n3500 transfers estimated',
        rechargeTab4: '3.0 EOS\n3000 ms\n10k transfers estimated',
        rechargeAccount: 'Recharge',
        currentAccount: 'Current Account',
        otherAccount: 'Other Account',
        refundNow: 'Refund Now',
    },

    // 设置页面
    setting: {
        wallet: 'Wallet',
        resources: 'Resources',
        application: 'Application',
        setting: 'Settings',
        manageWallets: 'Manage Wallets',
        setLanguage: 'Language',
        nodesSetting: 'Nodes Setting',
        manageNetworks: 'Manage Networks',
        confirmDelete: 'Confirm Delete?',
        confirmRemove: 'Confirm Remove?',
        confirmDestroy: 'Confirm destroy all data stored in the Metahub?',
        reconfirm: 'Reconfirm',
        currentVersion: 'Current version',
        aboutUs: 'About Us',
        alreadyNewestVersion: 'Already the latest version.',
        managePermissions: 'Manage Permissions',
        exportPrivateKey: 'Export PrivateKey',
        clearAbiCache: 'Claer ABI Cache',
        pingTip: 'ping...',
        defaultNodes: 'Default Nodes',
        delay: 'Delay',
        customNodes: 'Custom Nodes',
        inputNodeAddress: 'Please input the node address',
        addNode: 'Add custom node',
        nodeSelect: 'Nodes Setting',
        authorityManage: 'Authority Manage',
        accountName: 'Account Name',
        currentAccount: 'Current Account',
        notice: 'Notice:',
        ownerNotice: 'Owner : Have all permissions for the current EOS Account.',
        activeNotice:
            'Active : By default, all transations can be done except to change the Owner.',
        securityNotice:
            'For the scurity of your assets, it is recommended to use the Active Permissions to import the wallet. And keep the Owner Permissions in a safe place.',
        add: 'Add',
        remove: 'Remove',
        modify: 'Modify',
        removeTip: 'Are you sure to remove?',
        removeWalletTip: 'Are you sure to delete the account data from the Metahub?',
        changeAuthority: 'Change Authority',
        newPublicKey: 'Public Key',
        newPrivateKey: 'Private Key',
        currentPublicKey: 'Current PublicKey',
        generatePublicKey: 'Key Generator',
        changeNoticeOne:
            'If you are replacing the currently used public key, you need to re-import the wallet with the private key to use it.',
        changeNoticeTwo:
            'Please comfirm that the private key corresponding to the public key is properly kept.',
        submit: 'Submit',
        removeWallet: 'Remove Wallet',
        copy: 'Copy',
        copySuccess: 'Copy success',
        copyFailure: 'Copy failure',
        useIt: 'Use It',
        refresh: 'Refresh',
        enterPublicKeyTip: 'Please enter a Public Key',
        generateTipOne: 'Do not disclose the following to anyone.',
        generateTipTwo:
            'It is recommended to copy or print the private key and place it in a safe place.',
        generateTipThree: 'Do not use a network tool to transfer private keys.',
        operate: 'Operate',
        invalidPublicKey: 'Invalid Public Key',
        lockWallets: 'Lock Wallet',
        exportWallet: 'Backup Wallet',
        destroyWallet: 'Destroy Wallet',
        changePassword: 'Change Password',
        oldPassword: 'Old password',
        newPassword1: 'New unlock password',
        newPassword2: 'Repeat unlock password',
        walletPassowrd: 'Wallet unlock passowrd',
        encryptPassword: 'Wallet encrypt passowrd',
        encryptPasswordTip:
            'Encrypt password should be greater than 8 digits and include letters and numbers',
        whitelist: 'Whitelist',
        whiteListCancel: 'Cancel',
        whiteListCancel2: 'Cancel',
        whiteListAny: 'Any',
        addExistingNetwork: 'Add existing network',
        addCustomNetwork: 'Add custom network',
        enableNetwork: 'Enable network',
        name: 'Name',
        chain: 'Chain',
        operation: 'Operation',
        sureAddPrefix: 'Are you sure you want to add the "',
        sureAddSuffix: '"network?',
        sureDeletePrefix: 'Are you sure you want to delete the "',
        sureDeleteSuffix: '"network?',
        nodeName: 'Node Name',
        blockchainFoundation: 'Blockchain',
        defaultNode: 'Default Node',
        defaultNodeFormatIsIncorrect: 'The default node format is incorrect',
        defaultSymbol: 'Default Symbol',
        defineContractNameAndPrecision: 'Define contract name and precision',
        blockchainFoundationIsRequire: 'Blockchain is require',
        contractName: 'Contract Name',
        nameIsRequired: 'Name is required',
        chainIdIsRequire: 'ChainId is require',
        defaultSymbolIsRequire: 'DefaultSymbol is require',
        contractNameRequired: 'Contract name is required',
        precisionMustBeAnInteger: 'Precision must be an integer',
        precisionMustBeBetween: 'Precision must be between 0-8',
        symbol: 'Symbol',
        precision: 'Precision',
        lengthMustBe64Characters: 'Length must be 64 characters',
        alreadyExist: 'The same blockchain foundation and ChainId already exists',
        alreadyExistNetwork: 'The network with the same name already exists',
        alreadyExistAccount:
            'This network has an account import, please delete the account before operating',
    },

    // 钱包页面
    wallet: {
        assets: 'Assets',
        totalAssets: 'Total Assets',
        transfer: 'Transfer',
        vote: 'Vote',
        stake: 'Stake',
        receive: 'Receive',
        detail: 'Details',
        balance: 'Balance',
        contract: 'Contract',
        website: 'Website',
        totalCirculation: 'Total Circulation',
        format: 'Format',
        accountInfo: 'Account Name',
        copyAccountName: 'Copy account',
        copied: 'Copy account name success',
        paymentAccount: 'Payment Account',
        receiverAccount: 'Receiver Account',
        amount: 'Amount',
        remark: 'Remark',
        memo: 'Memo',
        symbol: 'Token',
        symbols: 'Tokens',
        emptyReceiver: 'Please enter the account of the recipient',
        errorReceiver: 'Incorrect payment account format',
        emptyAmount: 'Please enter the amount',
        errorAmount: 'Please enter a positive number',
        transferSuccess: 'Transfer success',
        transferSelf: 'Can’t transfer to yourself',
        accountNotExist: 'Account does not exist',
        noMoreData: 'No More Data',
        addNewTokens: 'Add New Tokens',
        searchKeyWord: 'Search by the Symbol or Contract',
        voted: 'Voted',
        voteSuccess: 'Successful vote',
        rank: 'rank',
        area: 'area',
        transferInfo: 'Transaction Info',
        tradeHistory: 'Transaction records',
        transation: 'Transation Detail',
        transationHASH: 'Transation HASH',
        blockNumber: 'Block Number',
        transationTime: 'Time',
        moreDetail: 'More Detail',
        nodeVote: 'Producers Voting',
        nodeVoteTip1: '1、Before you can vote, you need to stake your EOS.',
        nodeVoteTip2: '2、You can get your EOS back in 72 hours after reclaim.',
        importSelectedWallets: 'Import Selected',
        unknown: 'unknown',
        setAmount: 'Set the amount',
        all: 'All',
        recentTransfers: 'Recent Transfers',
        addMoreTokens: 'Add more Tokens',
        contractName: 'Contract name',
        symbolName: 'Symbol name',
        required: 'Required',
        submit: 'Submit',
        addTokenSuccessfully: 'Added successfully',
        addTokenFailed: 'Did not find the token',
        addTokenExist: 'This currency is already in your list',
        importSuccess: 'Accounts import Successfully',
        backupSuccess: 'Wallets backup Successfully',
        selectOneAtLeast: 'Please select at least one to import',
        searchTip: 'Search',
    },

    // 钱包密码
    password: {
        submit: 'Submit',
        cancel: 'Cancel',
        verifyPassword: 'Verify Password',
        toUnlock: 'Wallet Unlock Password',
        inputPasswrod: 'Please enter the unlock password',
        deleteSuccess: 'Delete success',
        thisTime: 'This time',
        one: 'No password before hour',
        six: 'No password before hours',
        close: 'No password before exit',
        empty: 'Password can not be empty',
        error: 'Password Error',
        unlock: 'Unlock',
        welcome: 'Welcome back!',
        unlockTip:'Make sure you enter the unlock password in the correct window.',
    },

    // 授权
    auth: {
        submit: 'Submit',
        cancel: 'Cancel',
        authorizeLogin: 'Authorize Login',
        authorize: 'Authorize',
        changeAccount: 'Change Account',
        searchAccounts: 'Search Accounts',
        login: 'Login',
        chooseAccount: 'Choose Account',
        back: 'Back',
        loginTip: '{0} request login',
        executionContract: 'Contract Execution',
        requestSignature: 'Request Signature',
        property: 'Property',
        joinWhitelist: 'Add to Whitelist',
        canNotAdd: 'Multiple actions for whitelist is not supported currently',
        whitelistTip:
            'You can whitelist these actions, and you do not have to confirm these transactions. You can confirm what you need to whitelist by checking the checkbox.',
    },
    // 应用
    application: {
        myDApps: 'My Dapps',
        recommended: 'Recommended',
        createBosAccount: 'Create BOS Account',
        publicKey: 'Public Key',
        privateKey: 'Private Key',
        publicKeyPlaceholder: 'Please enter public key',
        privateKeyPlaceholder: 'Please enter private key(optional)',
        publicKeyErrorTip: 'Please enter a legal public key',
        privateKeyErrorTip: 'Please enter a legal private key',
        accountName: 'Account Name',
        inviteCode: 'Invite Code',
        accountErrorTip: 'Support for lowercase letters a-z and array 12345 12-digit account name',
        createAccount: 'Create Account',
        createSuccessTip: 'Created Success',
    },

    error: {
        firstNeedEOS:
            'This ETH payment address is used for the first time, you need to transfer more than 0.1 EOS to activate it.',
        cpuTimeLimit: 'The CPU time of smooth mode is used up, please recharge.',
    },
};
