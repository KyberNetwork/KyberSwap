

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
    if (data.sourceTokenSymbol !== "ETH") {
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
    } else {
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