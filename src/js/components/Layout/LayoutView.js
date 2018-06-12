import React from "react"
import { Switch, Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import { Link } from 'react-router-dom'

import constansts from "../../services/constants"
//import { Rate } from "../Header"

const LayoutView = (props) => {
  return (
    <ConnectedRouter history={props.history}>
      <div>
        <Route component={props.Header} />
        <section id="content">
          <Switch>
            <Route exact path={constansts.BASE_HOST} component={props.ImportAccount} />
            <Route exact path={constansts.BASE_HOST + "/exchange"} component={props.Exchange} />
            <Route exact path={constansts.BASE_HOST + "/transfer"} component={props.Transfer} />            
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