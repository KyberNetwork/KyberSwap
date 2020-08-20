import * as common from "../../utils/common"

export default class GoogleTagmanager {
  initService(network) {
    // if (typeof dataLayer !== "undefined") {
    //     dataLayer = undefined
    // }

    // if (network === 'Mainnet' || network === 'Production') {
    //     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //     })(window,document,'script','dataLayer','GTM-NFK79RR')
    // } else {
    //     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //     })(window,document,'script','dataLayer','GTM-KMWZ7XB')
    // }

    this.addUserIdentity()
  }

  addUserIdentity() {
    // if (typeof dataLayer === "undefined") return;

    // var userCookies = common.getCookie("dataLayer_user_cookies")
    // if (!userCookies) {
    //   userCookies = Math.random().toString(36).slice(2)
    //   common.setCookie("dataLayer_user_cookies", userCookies)
    // }

    // dataLayer.identify(userCookies);
    // dataLayer.people.set_once({
    //   "$distinct_id": userCookies,
    //   "$name": userCookies
    // });
  }

  loginWallet(wallet) {
    if (wallet === 'keystore') wallet = 'json'

    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
            event: "Swap_LoginWallet",
            wallet: wallet
        })
      }catch(e){
        console.log(e)
      }
    }
  }


  completeTrade(hash, walletType, tradeType) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
            event: "Swap_CompleteTrade",
            hash, walletType, tradeType
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  txMinedStatus(hash, walletType, tradeType, status, address, accountType) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
            event: "Swap_Tx_Mined",
            hash, walletType, tradeType, status, address, accountType
        })
      }catch(e){
        console.log(e)
      }
    }
  }


  trackCoinExchange(data) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_Swap",
          source: data.sourceTokenSymbol,dest: data.destTokenSymbol
        })
      }catch(e){
        console.log(e)
      }
    }
  }
  
  trackWalletVolume(walletType, srcTokenSymbol, srcAmount, destTokenSymbol) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function') {
      try {
        dataLayer.push("Swap_WalletVolume", { walletType, srcTokenSymbol, srcAmount, destTokenSymbol })
      } catch(e) {
        console.log(e)
      }
    }
  }

  trackCoinTransfer(token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_Transfer",
          token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  tokenForCharting(token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_1_Click_ViewChart",
          token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  acceptTerm(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Step_1_Accept_Term"
        })
      }catch(e){
        console.log(e)
      }
    }
  }
  
  trackViewingKyberSwapApp(os) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try {
        dataLayer.push({
          event: "Step_1_View_KyberSwap_App",
          os
        })
      } catch(e) {
        console.log(e)
      }
    }
  }

  trackBaseCurrency(currency){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_2_Click_Currency",
          currency
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChooseGas(type, gas, typeGas){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
            event: `Step_3_select_advance_feature_${type}_choose_gas`,
            gas: gas, typeGas: typeGas
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSearchTokenBalanceBoard(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_3_Click_Search_Token_Balance_board",
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickAllIn(type, token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_3_Click_Use_All_Token_Balance",
          type: type, token: token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSetNewMinrate(minrate){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Step_3_select_advance_feature_swap_min_rate",
          minrate: minrate
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackCustomGasPrice(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_Gas_Input"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChooseToken(type, token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `Step_3_select_${type}_token`,
          token: token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSearchToken(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_2_Click_Search_Token"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSwapDestSrc(sourceToken, destToken){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Step_3_select_swap_token"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSwapButton(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Step_4_click_swap"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTransferButton(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Step_4_click_transfer"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickNewTransaction(type){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_6_Click_New_Transaction",
          type: type
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickApproveToken(token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_5_Click_Approve_Token",
          token: token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackConfirmTransaction(type, token){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `Step_5_click_confirm_${type}`,
          token: token
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackBroadcastedTransaction(timeout) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === "function") {
      try {
        dataLayer.push({
          event: "Swap_ConfirmTime",
          value: timeout
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  trackClickBreadCrumb(path){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_1_Click_BreadCrumb",
          path: path
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickViewTxOnEtherscan(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_View_Transaction_On_Etherscan"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCopyTx(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_6_Click_Copy_Tx"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputRecieveAddress(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_2_1_Click_To_Input_Address_Transfer"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCloseModal(typeModal){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_2_Click_To_Close_Modal",
          typeModal: typeModal
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickGetMoreAddressDevice(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_GetMore_Device_Address"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickGetPreAddressDevice(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_GetPrevious_Device_Address"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackOpenModalColdWallet(walletType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: "Swap_*_2_Open_Modal_ColdWallet",
          walletType: walletType
        })
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCustomPathColdWallet(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_4_Click_Custom_Path_ColdWallet"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChoosePathColdWallet(path){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_4_Click_Choose_Path_ColdWallet", path: path})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowPassword(status){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_2_Click_Show_Password", status: status})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowTermAndCondition(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_1_Click_Show_Term_And_Condition"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPasswordWithJSON(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_4_Click_Input_Passphrase"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickImportAccount(type, screen){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Connect_wallet_${type}_${screen}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPrKey(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_Input_Private_Key"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPromoCode(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_2_2_Click_Input_Promo_Code"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSubmitPrKey(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_3_Click_Submit_Private_Key"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSubmitPromoCode(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_2_3_Click_Submit_Promo_Code"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputAmount(type){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_3_select_${type}_amount`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAddressOnEtherescan(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_1_Click_Show_Address_On_Etherescan"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTheLeftWing(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_1_Click_Show_Wallet", tradeType: tradeType})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTheRightWing(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_*_1_Click_Show_Advanced", tradeType: tradeType})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackAccessToSwap(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Session_Swap_Start"})
      }catch(e){
        console.log(e)
      }
    }
  }

  exitSwap(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Session_Swap_End"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChooseBalance(percent){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_Click_Choose_Blance_" + percent})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputCapcha(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_2_2_Click_Input_Capcha"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChangeCapcha(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Swap_2_2_Click_Change_New_Capcha"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChangeWallet(){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: "Step_2_Connect_Other_Wallet"})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAccountBalance(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Show_Account_Balance_${tradeType}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAdvanceOption(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Show_Advance_Option_${tradeType}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickHideAccountBalance(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Hide_Account_Balance_${tradeType}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickHideAdvanceOption(tradeType){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Hide_Advance_Option_${tradeType}`})
      }catch(e){
        console.log(e)
      }
    }
  }
  trackClickToken(symbol, screen){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Step_2_Click_Top_Token_${screen}_${symbol}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTokenInAccountBalance(symbol, screen){
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `Account_balance_Select_Token_${screen}_${symbol}`})
      }catch(e){
        console.log(e)
      }
    }
  }

  /**
   * Limit Order
   */
  trackClickSubmitOrder() {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Submit`});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConfirmSubmitOrder() {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Confirm_Submit`});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickCancelOrder(orderId) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Cancel`, orderId});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConfirmCancelOrder(orderId) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Confirm_Cancel`, orderId });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConvertEth() {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Convert_Eth`});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderFocusAmount(type) {
    // Type: source, dest, rate
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);
        dataLayer.push({event: `LimitOrder_Focus_${capitalizeType}_Amount`});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderSelectToken(type, token) {
    // Type: source, dest
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);
        dataLayer.push({event: `LimitOrder_Select_${capitalizeType}_Amount`, token });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickApprove(type, token) {
    // Type: Zero, Max
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: `LimitOrder_Click_Approve_Token_${type}`, token});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickChooseMarket(market) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({event: 'LimitOrder_Click_Choose_Market', market});
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSort(field, isDsc) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Sort_${field}`,
          typeSort: isDsc ? 'dsc' : 'asc'
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSortOnWalletPanel(field, isDsc) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Sort_On_Wallet_Panel_${field}`,
          typeSort: isDsc ? 'dsc' : 'asc' 
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickChooseSideTrade(sideTrade, base, quote) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Choose_Side_${sideTrade}`,
          base: base, quote: quote
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSelectPair(pair) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Select_Pair`,
          pair 
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickFavoritePair(typeUser, pair, isFavorite) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Favorite_Pair`,
          typeUser: typeUser, pair: pair, isFavorite: isFavorite
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickChangeSourceAmountByPercentage(percent) {
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Change_Source_Amount_By_Percentage`,
          percent
        });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickShowWalletBalance(isShow) {
    let status = isShow? 'show' : 'hide'
    if (typeof dataLayer !== "undefined" && typeof dataLayer.push === 'function'){
      try{
        dataLayer.push({
          event: `LimitOrder_Click_Show_Wallet_Balance`,
          status
        });
      }catch(e){
        console.log(e);
      }
    }
  }
}
