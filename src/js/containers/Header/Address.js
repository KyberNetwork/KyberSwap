import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'

import { clearSession } from "../../actions/globalActions"
import { AddressView } from "../../components/Header"
import { Notify } from "../Header";
import { getTranslate } from 'react-localize-redux'
@connect((store, props) => {
  const path = props.path
  return {...store.account, 
    path,
    translate: getTranslate(store.locale),
  }
})

export default class Address extends React.Component {
  
  handleEndSession = () => {
    this.props.dispatch(clearSession()) 
  }

	render() {
    var notify = (
      <Notify />
    )
  
    return (
        <AddressView address={this.props.account.address}
                     parrentProps={this.props}
                     endSession={this.handleEndSession} 
                     path = {this.props.path}
                     notify = {notify}
                     translate={this.props.translate}
        />
    )
  }
}
