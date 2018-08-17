

export function changePath(path) {
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'ChangePath', {
                'event_category': "path",
                'event_label': path,
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "ChangePath", { path: path })
        } catch (e) {
            console.log(e)
        }
    }
}

export function loginWallet(wallet) {
    if (wallet === 'keystore') wallet = 'json'
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', wallet, {
                'event_category': "LoginWallet",
                'event_label': wallet
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "LoginWallet", { wallet: wallet })
        } catch (e) {
            console.log(e)
        }
    }
}


export function completeTrade(hash, walletType, tradeType) {
    var type
    if (tradeType === "transfer") {
        type = "Transfer confirm"
    }
    if (tradeType === "exchange") {
        type = "Swap confirm"
    }
    if (typeof window.gtag === 'function') {
        try {
            // gtag('event', 'WalletTrade', {
            //     'event_category': "trade",
            //     'event_label': "trade",
            //     'value': tradeType
            // })
            window.gtag('event', type, {
                'event_category': "Confirm transaction",
                'event_label': tradeType,
            })
            //window.gtag('event', 'CompleteTrade', { hash: hash, wallet: walletType, trade: tradeType })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "CompleteTrade", { hash: hash, wallet: walletType, trade: tradeType })
        } catch (e) {
            console.log(e)
        }
    }
}


export function trackCoinExchange(data) {
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'SWAP CTA', {
                'event_category': "Swap",
                'event_label': `${data.sourceTokenSymbol}_${data.destTokenSymbol}`
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "Swap", { source: data.sourceTokenSymbol, dest: data.destTokenSymbol })
        } catch (e) {
            console.log(e)
        }
    }
}


export function trackCoinTransfer(token){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'TRANSFER CTA', {
                'event_category': "Transfer",
                'event_label': token
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "Transfer", { token: token })
        } catch (e) {
            console.log(e)
        }
    }
}

export function tokenForCharting(token){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'ViewChart', {
                'event_category': `viewChart: ${token}`,
                'event_label': token
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "ViewChart", { token: token })
        } catch (e) {
            console.log(e)
        }
    }
}

export function acceptTerm(){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'Accepted', {
                'event_category': "AcceptTerm",
                'event_label': "Accepted"
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "AcceptTerm", { accept: 'Accepted' })
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackBaseCurrency(currency){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', currency, {
                'event_category': "chooseBaseCurrency",
                'event_label': currency
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "chooseBaseCurrency", { currency: currency })
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackMarketSetting(field, value){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', `${field}: ${value}`, {
                'event_category': "marketSetting",
                'event_label': `${field}: ${value}`
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "marketSetting", { setting: field,  value: value})
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackChooseGas(gas, type){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', `${type}: ${gas}`, {
                'event_category': "chooseGasPrice",
                'event_label': `${type}: ${gas}`
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "chooseGasPrice", {type: type, gasPrice: gas})
        } catch (e) {
            console.log(e)
        }
    }
}
