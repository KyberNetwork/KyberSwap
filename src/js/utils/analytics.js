

export function changePath(path) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_ChangePath", {path: path})
        }catch(e){
            console.log(e)
        }
    }
    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'ChangePath', {
    //             'event_category': "path",
    //             'event_label': path,
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "ChangePath", { path: path })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function loginWallet(wallet) {
    if (wallet === 'keystore') wallet = 'json'

    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_LoginWallet", {wallet: wallet})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'LoginWallet', {
    //             'event_category': "wallet",
    //             'event_label': wallet
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "LoginWallet", { wallet: wallet })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}


export function completeTrade(hash, walletType, tradeType) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_CompleteTrade", {hash, walletType, tradeType})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'CompleteTrade', {
    //             'event_category': "trade",
    //             'event_label': tradeType,
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "CompleteTrade", { hash: hash, wallet: walletType, trade: tradeType })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}


export function trackCoinExchange(data) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_Swap", {source: data.sourceTokenSymbol,dest: data.destTokenSymbol})
        }catch(e){
            console.log(e)
        }
    }
    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'Swap', {
    //             'event_category': "Swap",
    //             'event_label': `${data.sourceTokenSymbol}_${data.destTokenSymbol}`
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "Swap", { source: data.sourceTokenSymbol, dest: data.destTokenSymbol })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}


export function trackCoinTransfer(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_Transfer", {token})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'Transfer', {
    //             'event_category': "transfer",
    //             'event_label': token
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "Transfer", { token: token })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function tokenForCharting(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_ViewChart", {token})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'ViewChart', {
    //             'event_category': "viewChart",
    //             'event_label': token
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "ViewChart", { token: token })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function acceptTerm(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_1_1_Click_AcceptTerm")
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'AcceptTerm', {
    //             'event_category': "AcceptTerm",
    //             'event_label': "Accepted"
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "AcceptTerm", { accept: 'Accepted' })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function trackBaseCurrency(currency){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Currency", {currency})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'chooseBaseCurrency', {
    //             'event_category': "currency",
    //             'event_label': currency
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "chooseBaseCurrency", { currency: currency })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function trackMarketSetting(field, value){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_MarketSetting", {field, value})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'marketSetting', {
    //             'event_category': "option",
    //             'event_label': `${field}: ${value}`
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "marketSetting", { setting: field,  value: value})
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function trackChooseGas(type, gas, typeGas){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_ChooseGas", {type: type, gas: gas, typeGas: typeGas})
        }catch(e){
            console.log(e)
        }
    }

    // if (typeof window.gtag === 'function') {
    //     try {
    //         window.gtag('event', 'chooseGasPrice', {
    //             'event_category': "gasPrice",
    //             'event_label': `${type}: ${gas}`
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // if (typeof window.fbq === 'function') {
    //     try {
    //         window.fbq('trackCustom', "chooseGasPrice", {type: type, gasPrice: gas})
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export function trackSearchETHMarket(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_To_Search_ETH_Market")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChooseTokenOnBalanceBoard(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_Choose_Token_Balance_Board", {token : token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSortBalanceBoard(type, sortType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_2_Click_Sort_Token_Balance_Board", {type: type, sortType: sortType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSearchTokenBalanceBoard(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_Search_Token_Balance_board")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickAllIn(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Use_All_Token_Balance", {type: type, token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSetNewMinrate(minrate){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Change_Min_Acceptable_Rate", {minrate: minrate})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackCustomGasPrice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Gas_Input")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChooseToken(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Choose_Token", {type: type, token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSearchToken(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Search_Token")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSortETHMarket(field, sortType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_1_1_Click_Sort_ETH_Market", {field: field, sortType: sortType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSwapDestSrc(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_To_Swap_Dest_Src")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSwapButton(){
    console.log("click swap button")
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_Swap_Button")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickTransferButton(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_Transfer_Button")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickNewTransaction(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_New_Transaction", {type: type})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickApproveToken(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Approve_Token", {token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackConfirmTransaction(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Confirm_Transaction", {token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickBack(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Back")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickBreadCrumb(path){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_BreadCrumb", {path: path})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickViewTxOnEtherscan(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_View_Transaction_On_Etherscan")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickCopyTx(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Copy_Tx")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputRecieveAddress(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_4_1_Click_To_Input_Address_Transfer")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickCloseModal(typeModal){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_To_Close_Modal", {typeModal: typeModal})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickGetMoreAddressDevice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_2_Click_GetMore_Device_Address")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickGetPreAddressDevice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_2_Click_GetPrevious_Device_Address")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackOpenModalColdWallet(walletType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_1_Open_Modal_ColdWallet", {walletType: walletType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickCustomPathColdWallet(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_3_Click_Custom_Path_ColdWallet")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChoosePathColdWallet(path){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_3_Click_Choose_Path_ColdWallet", {path: path})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickShowPassword(status){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Show_Password", {status: status})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickShowTermAndCondition(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_1_1_Click_Show_Term_And_Condition")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputPasswordWithJSON(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_4_2_Click_Input_Passphrase")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickImportAccount(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_1_Click_Import_Account", {walletType: type})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_2_Click_Input_Private_Key")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSubmitPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_3_Click_Submit_Private_Key")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputAmount(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Input_Amount", {type: type})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickShowAddressOnEtherescan(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_3_1_Click_Show_Address_On_Etherescan")
        }catch(e){
            console.log(e)
        }
    }
}
