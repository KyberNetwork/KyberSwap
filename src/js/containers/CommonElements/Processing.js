import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import { ProcessingModal } from '../../components/CommonElement'

@connect((store) => {
  return {account: store.account}
})

export default class Processing extends React.Component {
  
  render(){
    return (
      <ProcessingModal isEnable={this.props.account && this.props.account.loading}/>
    )  
  }
}

///  {this.props.account && this.props.account.loading ? processingModal : 'a'}