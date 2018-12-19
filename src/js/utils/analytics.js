

export function changePath(path) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_ChangePath", {path: path})
        }catch(e){
            console.log(e)
        }
    }
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
}


export function completeTrade(hash, walletType, tradeType) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_CompleteTrade", {hash, walletType, tradeType})
        }catch(e){
            console.log(e)
        }
    }
}


export function trackCoinExchange(data) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_Swap", {source: data.sourceTokenSymbol,dest: data.destTokenSymbol})
        }catch(e){
            console.log(e)
        }
    }
}


export function trackCoinTransfer(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_Transfer", {token})
        }catch(e){
            console.log(e)
        }
    }
}

export function tokenForCharting(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_ViewChart", {token})
        }catch(e){
            console.log(e)
        }
    }
}

export function acceptTerm(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Step_1_Accept_Term")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackBaseCurrency(currency){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_Currency", {currency})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackMarketSetting(field, value){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Click_MarketSetting", {field, value})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChooseGas(type, gas, typeGas){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(`Step_3_select_advance_feature_${type}_choose_gas`, {gas: gas, typeGas: typeGas})
        }catch(e){
            console.log(e)
        }
    }
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
            mixpanel.track("Swap_*_3_Click_Choose_Token_Balance_Board", {token : token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSortBalanceBoard(type, sortType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_4_Click_Sort_Token_Balance_Board", {type: type, sortType: sortType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSearchTokenBalanceBoard(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Search_Token_Balance_board")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickAllIn(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Use_All_Token_Balance", {type: type, token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackSetNewMinrate(minrate){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Step_3_select_advance_feature_swap_min_rate", {minrate: minrate})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackCustomGasPrice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Gas_Input")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChooseToken(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(`Step_3_select_${type}_token`, {token: token})
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
            mixpanel.track("Swap_*_1_Click_Sort_ETH_Market", {field: field, sortType: sortType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSwapDestSrc(sourceToken, destToken){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Step_3_select_swap_token")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSwapButton(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Step_4_click_swap")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickTransferButton(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Step_4_click_transfer")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickNewTransaction(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_6_Click_New_Transaction", {type: type})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickApproveToken(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_5_Click_Approve_Token", {token: token})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackConfirmTransaction(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(`Step_5_click_confirm_${type}`, {token: token})
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
            mixpanel.track("Swap_*_6_Click_Copy_Tx")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputRecieveAddress(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_2_1_Click_To_Input_Address_Transfer")
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
            mixpanel.track("Swap_*_3_Click_GetMore_Device_Address")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickGetPreAddressDevice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_GetPrevious_Device_Address")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackOpenModalColdWallet(walletType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_2_Open_Modal_ColdWallet", {walletType: walletType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickCustomPathColdWallet(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_4_Click_Custom_Path_ColdWallet")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackChoosePathColdWallet(path){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_4_Click_Choose_Path_ColdWallet", {path: path})
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
            mixpanel.track("Swap_*_1_Click_Show_Term_And_Condition")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputPasswordWithJSON(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_4_Click_Input_Passphrase")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickImportAccount(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(`Step_2_Connect_wallet_${type}`)
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Input_Private_Key")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputPromoCode(){
  if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
    try{
      mixpanel.track("Swap_2_2_Click_Input_Promo_Code")
    }catch(e){
      console.log(e)
    }
  }
}

export function trackClickSubmitPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_3_Click_Submit_Private_Key")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickSubmitPromoCode(){
  if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
    try{
      mixpanel.track("Swap_2_3_Click_Submit_Promo_Code")
    }catch(e){
      console.log(e)
    }
  }
}

export function trackClickInputAmount(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track(`Step_3_select_${type}_amount`)
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickShowAddressOnEtherescan(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Show_Address_On_Etherescan")
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickTheLeftWing(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Show_Wallet", {tradeType: tradeType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickTheRightWing(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_*_1_Click_Show_Advanced", {tradeType: tradeType})
        }catch(e){
            console.log(e)
        }
    }
}

export function trackAccessToSwap(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Session_Swap_Start")
        }catch(e){
            console.log(e)
        }
    }
}

export function exitSwap(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Session_Swap_End")
        }catch(e){
            console.log(e)
        }
    }
}



export function trackClickChooseBalance(percent){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_Click_Choose_Blance_" + percent)
        }catch(e){
            console.log(e)
        }
    }
}

export function trackClickInputCapcha(){
  if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
    try{
      mixpanel.track("Swap_2_2_Click_Input_Capcha")
    }catch(e){
      console.log(e)
    }
  }
}

export function trackClickChangeCapcha(){
  if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
    try{
      mixpanel.track("Swap_2_2_Click_Change_New_Capcha")
    }catch(e){
      console.log(e)
    }
  }
}
