import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import { ProcessingModal } from '../../components/CommonElement'
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    account: store.account,
    translate: getTranslate(store.locale)
  }
})

export default class Processing extends React.Component {
  
  render(){
    return (
      <ProcessingModal 
        isEnable={this.props.account && this.props.account.loading}
        checkTimeImportLedger={this.props.account.checkTimeImportLedger}
        translate={this.props.translate}
      />
    )  
  }
}