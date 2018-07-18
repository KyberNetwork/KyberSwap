import React from "react"
import { connect } from "react-redux"
import { TokenSelectorView } from '../../components/CommonElement'
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
    account: store.account.account,
    focusItem: props.focusItem,
    listItem: props.listItem,
    type: props.type,
    chooseToken: props.chooseToken,
    translate: getTranslate(store.locale)
  }
})

export default class TokenSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searchWord: "",
    }
  }

  changeWord = (e) => {
    var value = e.target.value.toLowerCase()
    this.setState({ searchWord: value })
  }

  showTokens = (e) => {
    this.setState({ open: true })
  }

  hideTokens = (e) => {
    this.setState({ open: false })
  }

  selectItem = (event, symbol, address) => {
    this.props.chooseToken(symbol, address, this.props.type)
    //this.toggleOpen()
    //console.log("toggle 2: " + this.state.open)
   // this.setState({ open: false })
  }

  render() {
    return (
      <TokenSelectorView
        open={this.state.open}
        searchWord={this.state.searchWord}
        listItem={this.props.listItem}
        focusItem={this.props.focusItem}
        toggleOpen={this.toggleOpen}
        changeWord={this.changeWord}
        selectItem={this.selectItem}
        translate={this.props.translate}
        showTokens = {this.showTokens}
        hideTokens = {this.hideTokens}
        account = {this.props.account}
      />
    )
  }
}
