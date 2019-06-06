import React from "react"
import { connect } from "react-redux"
import { TokenSelectorView } from '../../components/CommonElement'
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var listToken = []
  Object.values(props.listItem).map((value, i) => {
    listToken.push(value)
  })

  return {
    account: store.account.account,
    focusItem: props.focusItem,
    listToken: listToken,
    type: props.type,
    chooseToken: props.chooseToken,
    translate: getTranslate(store.locale),
    banToken: props.banToken,
    isFixToken: props.isFixToken,
    analytics: store.global.analytics
  }
})

export default class TokenSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searchWord: "",
      tokenNumberLimit: 20,
      isLoadAllTokens: false,
    }
  }

  setLoadAllTokens = () => {
    this.setState({ isLoadAllTokens: true })
  }

  changeWord = (e) => {
    var value = e.target.value.toLowerCase()
    this.setState({ isLoadAllTokens: true, searchWord: value })
  }

  showTokens = (e) => {
    this.setState({ open: true })
  }

  hideTokens = (e) => {
    this.setState({ 
      open: false, 
      searchWord: "",
    })
  }

  selectItem = (event, symbol, address) => {
    this.props.chooseToken(symbol, address, this.props.type)
  }

  render() {
    return (
      <TokenSelectorView
        account={this.props.account}
        open={this.state.open}
        searchWord={this.state.searchWord}
        tokens={this.props.listToken}
        focusItem={this.props.focusItem}
        toggleOpen={this.toggleOpen}
        changeWord={this.changeWord}
        selectItem={this.selectItem}
        translate={this.props.translate}
        showTokens={this.showTokens}
        hideTokens={this.hideTokens}
        type={this.props.type}
        banToken={this.props.banToken}
        isFixToken={this.props.isFixToken}
        analytics={this.props.analytics}
        onListScroll = {this.setLoadAllTokens}
        screen={this.props.screen}
        tokenNumberLimit={this.state.tokenNumberLimit}
        isLoadAllTokens={this.state.isLoadAllTokens}
      />
    )
  }
}
