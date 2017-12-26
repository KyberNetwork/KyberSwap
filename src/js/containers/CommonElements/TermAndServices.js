import React from "react"
import {Modal} from "../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return { 
    clickCheckbox : props.clickCheckbox,
    termAgree: props.termAgree,
    translate: getTranslate(store.locale)
  }
})

export default class TermAndServices extends React.Component {

  constructor(){
    super()
    this.state = {
      isCheck : false
    }
  }

  showTerms = () => {
    this.setState({isCheck: true})
  }

  onRequestClose = () => {
    this.setState({isCheck: false})
  }

  changeCheckbox = (e) => {
    var value = e.target.checked
    this.props.clickCheckbox(value)    
  }

  content = () =>{
    return (
      <div>Content of terms and services</div>
    )
  }

  render() {
    return (
      <div>
        <div className="term-services">
          <input type="checkbox" onChange = {(e) => this.changeCheckbox(e)} checked = {this.props.termAgree}/>
          <span onClick = {this.showTerms}>{this.props.translate("transaction.terms_and_conditions") || <span>Terms and <br></br> Conditions </span>}</span>
        </div>

        <Modal className={{base: 'reveal large',
            afterOpen: 'reveal large'}}
            isOpen={this.state.isCheck}
            onRequestClose={this.onRequestClose}
            contentLabel="Terms and Services"
            content = {this.content()}
            size="large"
            />
      </div>
    )
  }
}
