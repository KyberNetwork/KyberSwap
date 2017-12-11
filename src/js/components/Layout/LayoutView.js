import React from "react"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import { Link } from 'react-router-dom'

const LayoutView = (props) => {
  return (
    <ConnectedRouter history={props.history}>
      <div>
        <Route component={props.Header} />
        <section id="content">
          <Route exact path="/" component={props.ImportAccount} />
          <Route exact path="/info" component={props.InfoKyber} />
          <Route exact path="/exchange" component={props.Exchange} />
          <Route exact path="/transfer" component={props.Transfer} />
          <Processing />
          {props.exchangeHistory}
        </section>
        <section id="modals">
          <InfoModal />
        </section>
        <section id="footer">
          {props.footer}
        </section>
      </div>
    </ConnectedRouter>
  )
}

export default LayoutView;