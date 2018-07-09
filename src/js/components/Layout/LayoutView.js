import React from "react"
import { Switch, Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import { Link } from 'react-router-dom'

import constansts from "../../services/constants"

import BLOCKCHAIN_INFO from "../../../../env"
//import { Rate } from "../Header"


function getAllPathToken(){
  var tokens = []
  Object.keys(BLOCKCHAIN_INFO.tokens).map(key => {
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

const LayoutView = (props) => {
  var listToken = getAllPathToken()
  console.log(listToken)
  return (
    <ConnectedRouter history={props.history}>
      <div>
        <Route component={props.Header} />
        <section id="content">
          <Switch>
            {/* <Route exact path={constansts.BASE_HOST} component={props.ImportAccount} /> */}

            <Route exact path={constansts.BASE_HOST + `/swap/:source${listToken}_:dest${listToken}`} component={props.Exchange} />
            <Route exact path={constansts.BASE_HOST + `/transfer/:source${listToken}`} component={props.Transfer} />       
            {/* <Route component={props.ImportAccount}/>      */}
            <Redirect to={constansts.BASE_HOST + "/swap/eth_knc"} />
          </Switch>
          {/* <div id="rate-bar" class="mb-8">
            {props.rate}
          </div> */}
          
          <Processing />
          {props.market}
          {/* <div id="footer">
            {props.footer}
          </div> */}
        </section>
        <section id="modals">
          <InfoModal />
        </section>
        {/* <section id="footer">
          {props.footer}
        </section> */}
      </div>
    </ConnectedRouter>
  )
}

export default LayoutView;