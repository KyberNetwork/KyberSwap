import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'

import { clearSession } from "../../actions/globalActions"
import { AddressView } from "../../components/Header"
@connect((store) => {
  return {...store.account}
})

export default class Address extends React.Component {
  
  handleEndSession(store){
    store.dispatch(clearSession()) 
  }

	render() {
    return (
        <AddressView address={this.props.account.address}
                     parrentProps={this.props}
                     endSession={this.handleEndSession} 
                     store={this.props}/>
    )
  }
}
