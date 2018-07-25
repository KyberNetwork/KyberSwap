

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
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'LoginWallet', {
                'event_category': "wallet",
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
    if (typeof window.gtag === 'function') {
        try {
            // gtag('event', 'WalletTrade', {
            //     'event_category': "trade",
            //     'event_label': "trade",
            //     'value': tradeType
            // })
            window.gtag('event', 'CompleteTrade', {
                'event_category': "trade",
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
            window.gtag('event', 'SellToken', {
                'event_category': "sell",
                'event_label': data.sourceTokenSymbol
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "SellToken", { token: data.sourceTokenSymbol })
        } catch (e) {
            console.log(e)
        }
    }
    
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'BuyToken', {
                'event_category': "buy",
                'event_label': data.destTokenSymbol
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "BuyToken", { token: data.destTokenSymbol })
        } catch (e) {
            console.log(e)
        }
    }
}


export function trackCoinTransfer(token){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'Transfer', {
                'event_category': "transfer",
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
                'event_category': "chart",
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
            window.gtag('event', 'Accept', {
                'event_category': "accept",
                'event_label': "accept"
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "Accept", { accept: true })
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackBaseCurrency(currency){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'chooseCurrency', {
                'event_category': "currency",
                'event_label': currency
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "chooseCurrency", { currency: currency })
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackMarketSetting(field, value){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'marketOption', {
                'event_category': "option",
                'event_label': field
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "marketOption", { field: value })
        } catch (e) {
            console.log(e)
        }
    }
}

export function trackChooseGas(gas, type){
    if (typeof window.gtag === 'function') {
        try {
            window.gtag('event', 'chooseGas', {
                'event_category': "chooseGas",
                'event_label': gas
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (typeof window.fbq === 'function') {
        try {
            window.fbq('trackCustom', "chooseGas", { gas: gas , type: type})
        } catch (e) {
            console.log(e)
        }
    }
}
