import * as common from "../../utils/common"

export default class Mixpanel {
  initService(network) {
    if (typeof mixpanel !== "undefined") {
      mixpanel = undefined
    }

    if (network === 'Mainnet' || network === 'Production') {
      (function (e, a) {
        if (!a.__SV) {
          var b = window; try { var c, l, i, j = b.location, g = j.hash; c = function (a, b) { return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null }; g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search))) } catch (m) { } var k, h; window.mixpanel = a; a._i = []; a.init = function (b, c, f) {
            function e(b, a) {
              var c = a.split("."); 2 == c.length && (b = b[c[0]], a = c[1]); b[a] = function () {
                b.push([a].concat(Array.prototype.slice.call(arguments,
                  0)))
              }
            } var d = a; "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel"; d.people = d.people || []; d.toString = function (b) { var a = "mixpanel"; "mixpanel" !== f && (a += "." + f); b || (a += " (stub)"); return a }; d.people.toString = function () { return d.toString(1) + ".people (stub)" }; k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
            for (h = 0; h < k.length; h++)e(d, k[h]); a._i.push([b, c, f])
          }; a.__SV = 1.2; b = e.createElement("script"); b.type = "text/javascript"; b.async = !0; b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol && "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js"; c = e.getElementsByTagName("script")[0]; c.parentNode.insertBefore(b, c)
        }
      })(document, window.mixpanel || []);
      mixpanel.init("2c27cf48c0454e7f366bf47eb001dc57");
    } else {
      (function (e, a) {
        if (!a.__SV) {
          var b = window; try { var c, l, i, j = b.location, g = j.hash; c = function (a, b) { return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null }; g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search))) } catch (m) { } var k, h; window.mixpanel = a; a._i = []; a.init = function (b, c, f) {
            function e(b, a) {
              var c = a.split("."); 2 == c.length && (b = b[c[0]], a = c[1]); b[a] = function () {
                b.push([a].concat(Array.prototype.slice.call(arguments,
                  0)))
              }
            } var d = a; "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel"; d.people = d.people || []; d.toString = function (b) { var a = "mixpanel"; "mixpanel" !== f && (a += "." + f); b || (a += " (stub)"); return a }; d.people.toString = function () { return d.toString(1) + ".people (stub)" }; k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
            for (h = 0; h < k.length; h++)e(d, k[h]); a._i.push([b, c, f])
          }; a.__SV = 1.2; b = e.createElement("script"); b.type = "text/javascript"; b.async = !0; b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol && "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js"; c = e.getElementsByTagName("script")[0]; c.parentNode.insertBefore(b, c)
        }
      })(document, window.mixpanel || []);
      mixpanel.init("9c78999aea94c92497693a5a0c7e6890");
    }

    this.addUserIdentity()
  }

  addUserIdentity() {
    if (typeof mixpanel === "undefined") return;

    var userCookies = common.getCookie("mixpanel_user_cookies")
    if (!userCookies) {
      userCookies = Math.random().toString(36).slice(2)
      common.setCookie("mixpanel_user_cookies", userCookies)
    }

    mixpanel.identify(userCookies);
    mixpanel.people.set_once({
      "$distinct_id": userCookies,
      "$name": userCookies
    });
  }

  loginWallet(wallet) {
    if (wallet === 'keystore') wallet = 'json'

    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_LoginWallet", {wallet: wallet})
      }catch(e){
        console.log(e)
      }
    }
  }


  completeTrade(hash, walletType, tradeType) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_CompleteTrade", {hash, walletType, tradeType})
      }catch(e){
        console.log(e)
      }
    }
  }

  txMinedStatus(hash, walletType, tradeType, status, address, accountType) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_Tx_Mined", {hash, walletType, tradeType, status, address, accountType})
      }catch(e){
        console.log(e)
      }
    }
  }


  trackCoinExchange(data) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_Swap", {source: data.sourceTokenSymbol,dest: data.destTokenSymbol})
      }catch(e){
        console.log(e)
      }
    }
  }
  
  trackWalletVolume(walletType, srcTokenSymbol, srcAmount, destTokenSymbol) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function') {
      try {
        mixpanel.track("Swap_WalletVolume", { walletType, srcTokenSymbol, srcAmount, destTokenSymbol })
      } catch(e) {
        console.log(e)
      }
    }
  }

  trackCoinTransfer(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_Transfer", {token})
      }catch(e){
        console.log(e)
      }
    }
  }

  tokenForCharting(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_ViewChart", {token})
      }catch(e){
        console.log(e)
      }
    }
  }

  acceptTerm(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_1_Accept_Term")
      }catch(e){
        console.log(e)
      }
    }
  }
  
  trackViewingKyberSwapApp(os) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try {
        mixpanel.track("Step_1_View_KyberSwap_App", {os})
      } catch(e) {
        console.log(e)
      }
    }
  }

  trackBaseCurrency(currency){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_2_Click_Currency", {currency})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChooseGas(type, gas, typeGas){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_3_select_advance_feature_${type}_choose_gas`, {gas: gas, typeGas: typeGas})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSearchTokenBalanceBoard(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_Search_Token_Balance_board")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickAllIn(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_Use_All_Token_Balance", {type: type, token: token})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSetNewMinrate(minrate){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_3_select_advance_feature_swap_min_rate", {minrate: minrate})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackCustomGasPrice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_Gas_Input")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChooseToken(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_3_select_${type}_token`, {token: token})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackSearchToken(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_2_Click_Search_Token")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSwapDestSrc(sourceToken, destToken){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_3_select_swap_token")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSwapButton(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_4_click_swap")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTransferButton(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_4_click_transfer")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickNewTransaction(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_6_Click_New_Transaction", {type: type})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickApproveToken(token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_5_Click_Approve_Token", {token: token})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackConfirmTransaction(type, token){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_5_click_confirm_${type}`, {token: token})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackBroadcastedTransaction(timeout) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === "function") {
      try {
        mixpanel.track("Swap_ConfirmTime", { value: timeout });
      } catch (e) {
        console.log(e);
      }
    }
  }

  trackClickBreadCrumb(path){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_BreadCrumb", {path: path})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickViewTxOnEtherscan(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_View_Transaction_On_Etherscan")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCopyTx(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_6_Click_Copy_Tx")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputRecieveAddress(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_2_1_Click_To_Input_Address_Transfer")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCloseModal(typeModal){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_2_Click_To_Close_Modal", {typeModal: typeModal})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickGetMoreAddressDevice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_GetMore_Device_Address")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickGetPreAddressDevice(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_GetPrevious_Device_Address")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackOpenModalColdWallet(walletType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_2_Open_Modal_ColdWallet", {walletType: walletType})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickCustomPathColdWallet(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_4_Click_Custom_Path_ColdWallet")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackChoosePathColdWallet(path){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_4_Click_Choose_Path_ColdWallet", {path: path})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowPassword(status){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_2_Click_Show_Password", {status: status})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowTermAndCondition(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_Show_Term_And_Condition")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPasswordWithJSON(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_4_Click_Input_Passphrase")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickImportAccount(type, screen){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Connect_wallet_${type}_${screen}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_Input_Private_Key")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputPromoCode(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_2_2_Click_Input_Promo_Code")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSubmitPrKey(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_3_Click_Submit_Private_Key")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickSubmitPromoCode(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_2_3_Click_Submit_Promo_Code")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputAmount(type){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_3_select_${type}_amount`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAddressOnEtherescan(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_Show_Address_On_Etherescan")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTheLeftWing(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_Show_Wallet", {tradeType: tradeType})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTheRightWing(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_*_1_Click_Show_Advanced", {tradeType: tradeType})
      }catch(e){
        console.log(e)
      }
    }
  }

  trackAccessToSwap(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Session_Swap_Start")
      }catch(e){
        console.log(e)
      }
    }
  }

  exitSwap(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Session_Swap_End")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChooseBalance(percent){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_Click_Choose_Blance_" + percent)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickInputCapcha(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_2_2_Click_Input_Capcha")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChangeCapcha(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Swap_2_2_Click_Change_New_Capcha")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickChangeWallet(){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track("Step_2_Connect_Other_Wallet")
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAccountBalance(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Show_Account_Balance_${tradeType}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickShowAdvanceOption(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Show_Advance_Option_${tradeType}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickHideAccountBalance(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Hide_Account_Balance_${tradeType}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickHideAdvanceOption(tradeType){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Hide_Advance_Option_${tradeType}`)
      }catch(e){
        console.log(e)
      }
    }
  }
  trackClickToken(symbol, screen){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Step_2_Click_Top_Token_${screen}_${symbol}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  trackClickTokenInAccountBalance(symbol, screen){
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`Account_balance_Select_Token_${screen}_${symbol}`)
      }catch(e){
        console.log(e)
      }
    }
  }

  /**
   * Limit Order
   */
  trackClickSubmitOrder() {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Submit`);
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConfirmSubmitOrder() {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Confirm_Submit`);
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickCancelOrder(orderId) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Cancel`, { orderId });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConfirmCancelOrder(orderId) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Confirm_Cancel`, { orderId });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickConvertEth() {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Convert_Eth`);
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderFocusAmount(type) {
    // Type: source, dest, rate
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);
        mixpanel.track(`LimitOrder_Focus_${capitalizeType}_Amount`);
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderSelectToken(type, token) {
    // Type: source, dest
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1);
        mixpanel.track(`LimitOrder_Select_${capitalizeType}_Amount`, { token });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickApprove(type, token) {
    // Type: Zero, Max
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Approve_Token_${type}`, { token });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickChooseMarket(market) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track('LimitOrder_Click_Choose_Market', { market });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSort(field, isDsc) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Sort_${field}`, { typeSort: isDsc ? 'dsc' : 'asc' });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSortOnWalletPanel(field, isDsc) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Sort_On_Wallet_Panel_${field}`, { typeSort: isDsc ? 'dsc' : 'asc' });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickSelectPair(pair) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Select_Pair`, { pair });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickFavoritePair(typeUser, pair, isFavorite) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Favorite_Pair`, {typeUser: typeUser, pair: pair, isFavorite: isFavorite });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackLimitOrderClickChangeSourceAmountByPercentage(percent) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Change_Source_Amount_By_Percentage`, { percent });
      }catch(e){
        console.log(e);
      }
    }
  }

  trackClickShowWalletBalance(isShow) {
    let status = isShow? 'show' : 'hide'
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
      try{
        mixpanel.track(`LimitOrder_Click_Show_Wallet_Balance`, { status });
      }catch(e){
        console.log(e);
      }
    }
  }
}
