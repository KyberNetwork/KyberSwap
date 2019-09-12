import React, { Fragment } from "react"
import { Switch, Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import ImportByPromoCodeModal from "../../containers/ImportAccount/ImportByPromoCodeModal"
import constants from "../../services/constants"
import * as common from "../../utils/common"
import { store } from '../../store'
import { HeaderTransaction } from "../../containers/TransactionCommon";

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
  var tokens = []
  const now = common.getNowTimeStamp();

  Object.keys(listToken).map(key => {
    const lodListingTime = listToken[key].lod_listing_time;

    if (listToken[key].sp_limit_order && (!lodListingTime || now >= lodListingTime)) {
      tokens.push(key)
    }
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

const LayoutView = (props) => {
  var listToken = getAllPathToken(props.tokens)
  var listLimitOrderToken = getAllPathLimitOrderToken(props.tokens)

  var defaultPathExchange = constants.BASE_HOST + "/swap/eth-knc"
  var defaultPathTransfer = constants.BASE_HOST + "/transfer/eth"
  var defaultPathLimitOrder = constants.BASE_HOST + "/" + constants.LIMIT_ORDER_CONFIG.path + "/weth-knc"

  defaultPathExchange = common.getPath(defaultPathExchange, constants.LIST_PARAMS_SUPPORTED)
  defaultPathTransfer = common.getPath(defaultPathTransfer, constants.LIST_PARAMS_SUPPORTED)
  defaultPathLimitOrder = common.getPath(defaultPathLimitOrder, constants.LIST_PARAMS_SUPPORTED)

  return (
    <ConnectedRouter history={props.history} store ={store}>
      <Fragment>
        <section id="content" className={`${props.langClass} theme theme--${props.theme}`}>
          {process.env.env === "ropsten" &&
            <HeaderTransaction/>
          }
          <Switch>
            <Route exact path={constants.BASE_HOST + `/swap/:source${listToken}-:dest${listToken}`} component={props.Exchange} />
            <Route exact path={constants.BASE_HOST + `/transfer/:source${listToken}`} component={props.Transfer} />
            <Redirect from={constants.BASE_HOST + "/transfer"} to={defaultPathTransfer} />
            <Redirect from={constants.BASE_HOST + "/transfer/*"} to={defaultPathTransfer} />
            <Route exact path={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/:source${listLimitOrderToken}-:dest${listLimitOrderToken}`} component={props.LimitOrder} />
            <Redirect from={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}`} to={defaultPathLimitOrder} />
            <Redirect from={constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/*`} to={defaultPathLimitOrder} />
            <Redirect to={defaultPathExchange} />
          </Switch>
          <Processing/>
        </section>
        <section id="modals">
          <InfoModal />
          <ImportByPromoCodeModal/>
        </section>
      </Fragment>
    </ConnectedRouter>
  )
};

export default LayoutView;
