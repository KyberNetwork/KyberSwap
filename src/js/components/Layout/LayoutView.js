import React, { Fragment } from "react"
import { Switch, Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import ImportByPromoCodeModal from "../../containers/ImportAccount/ImportByPromoCodeModal"
import ImportByOtherConnectModal from "../../containers/ImportAccount/ImportByOtherConnectModal"
import constants from "../../services/constants"
import * as common from "../../utils/common"
import { store } from '../../store'
import { HeaderTransaction } from "../../containers/TransactionCommon";
import Portfolio from "../../containers/Portfolio/Portfolio";

function getAllPathToken(listToken){
  var tokens = []
  Object.keys(listToken).map(key => {
    tokens.push(key)
  })

  var path = "("
  for (var i = 0; i< tokens.length ; i++){
    if (i === tokens.length -1){
      path += tokens[i].toLowerCase() + "|" + tokens[i]
    }else{
      path += tokens[i].toLowerCase() + "|" + tokens[i] + "|"
    }
  }
  path += ")"
  return path
}

function getAllPathLimitOrderToken(listToken){
  let baseTokens = [];
  let quoteTokens = [];
  const now = common.getNowTimeStamp();

  Object.keys(listToken).map(key => {
    const lodListingTime = listToken[key].lod_listing_time;

    if (listToken[key].sp_limit_order && (!lodListingTime || now >= lodListingTime)) {
      if (listToken[key].is_quote) {
        quoteTokens.push(key);
      }
      
      baseTokens.push(key);
    }
  });
  
  return {
    baseTokenPath: getValidatedTokenPath(baseTokens),
    quoteTokenPath: getValidatedTokenPath(quoteTokens)
  }
}

function getValidatedTokenPath(tokens) {
  let path = "(";
  
  for (var i = 0; i < tokens.length ; i++) {
    if (i === tokens.length -1) {
      path += tokens[i].toLowerCase() + "|" + tokens[i]
    } else {
      path += tokens[i].toLowerCase() + "|" + tokens[i] + "|"
    }
  }
  
  path += ")";
  
  return path;
}

const LayoutView = (props) => {
  const listToken = getAllPathToken(props.tokens)
  const { baseTokenPath, quoteTokenPath } = getAllPathLimitOrderToken(props.tokens);

  let defaultPathExchange = constants.BASE_HOST + "/swap/eth-knc"
  let defaultPathTransfer = constants.BASE_HOST + "/transfer/eth"
  let defaultPathLimitOrder = constants.BASE_HOST + "/" + constants.LIMIT_ORDER_CONFIG.path + "/knc-weth"

  defaultPathExchange = common.getPath(defaultPathExchange, constants.LIST_PARAMS_SUPPORTED)
  defaultPathTransfer = common.getPath(defaultPathTransfer, constants.LIST_PARAMS_SUPPORTED)
  defaultPathLimitOrder = common.getPath(defaultPathLimitOrder, constants.LIST_PARAMS_SUPPORTED)

  return (
    <ConnectedRouter history={props.history} store ={store}>
      <Fragment>
        <section id="content" className={`${props.langClass}`}>
          {!process.env.integrate &&
            <HeaderTransaction/>
          }
          <Switch>
            <Route exact path={constants.BASE_HOST + `/swap/:source${listToken}-:dest${listToken}`} component={props.Exchange} />
            <Route exact path={constants.BASE_HOST + `/transfer/:source${listToken}`} component={props.Transfer} />
            <Route exact path={constants.BASE_HOST + `/portfolio`} component={Portfolio} />
            <Redirect from={constants.BASE_HOST + "/transfer"} to={defaultPathTransfer} />
            <Redirect from={constants.BASE_HOST + "/transfer/*"} to={defaultPathTransfer} />
            <Route exact path={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/:source${baseTokenPath}-:dest${quoteTokenPath}`} component={props.LimitOrder} />
            <Redirect from={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}`} to={defaultPathLimitOrder} />
            <Redirect from={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/*`} to={defaultPathLimitOrder} />
            <Redirect to={defaultPathExchange} />
          </Switch>
          <Processing/>
        </section>
        <section id="modals">
          <InfoModal />
          <ImportByPromoCodeModal/>
          <ImportByOtherConnectModal/>
        </section>
      </Fragment>
    </ConnectedRouter>
  )
};

export default LayoutView;
