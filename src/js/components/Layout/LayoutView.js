import React from "react"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Processing, InfoModal } from "../../containers/CommonElements/"
import { Link } from 'react-router-dom'

const LayoutView = (props) => {
      
  return (    
    <ConnectedRouter history={props.history}>
      <div>
        <Route component={props.Header}/>    
        <section id="content">
            <Route exact path="/" component={props.ImportAccount}/>              
            <Route exact path="/info" component={props.InfoKyber}/>                                          
            <Route exact path="/exchange" component={props.Exchange}/>
            <Route exact path="/transfer" component={props.Transfer}/>
            <Processing /> 
        </section>
        <section id="modals">
          <InfoModal/>
        </section>
        <section id="footer">
          <div class="row">
            <div class="column">
              <ul class="links">
                <li><Link to="/info">Info</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
                <li><Link to="#">Privacy Policies</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </div> 
    </ConnectedRouter> 
  )
}

export default LayoutView;