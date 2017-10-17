import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'

import { clearSession } from "../../actions/globalActions"

@connect((store) => {
  console.log(store)
  return {...store.account}
})

export default class Address extends React.Component {
  
  handleEndSession(){
    this.props.dispatch(clearSession()) 
  }

	render() {
    const address = this.props.address
    return (
        <div>
          { address ? <p>{address}</p> : ''}
          <Link to="/transfer" >
            Transfer
          </Link>
          <br/>
          <Link to="/exchange" >
            ExChange
          </Link>
          <br/>
          <a onClick={() => this.handleEndSession()}>End session</a>
        </div>
    )
  }
}
