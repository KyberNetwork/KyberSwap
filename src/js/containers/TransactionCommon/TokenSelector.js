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
      numDisplay: 20,
      listShowToken: [],
      isScroll: false
    }
  }

  componentDidMount = () => {
    this.setState({ listShowToken: this.props.listToken.slice(0, this.state.numDisplay) })
    
  }

  onListScroll = () => {
    if(!this.state.isScroll){
      this.setState({ listShowToken: this.props.listToken, isScroll: true })      
    }
  }

  changeWord = (e) => {
    var value = e.target.value.toLowerCase()
    this.setState({ searchWord: value })

    var listShowTokens = []
    for (var i = 0; i < this.props.listToken.length; i++) {
      var item = this.props.listToken[i]
      var matchName = item.name.toLowerCase().includes(value),
        matchSymbol = item.symbol.toLowerCase().includes(value)
      if (matchSymbol || matchName) {
        listShowTokens.push(item)
      }
    }
    this.setState({ listShowToken: listShowTokens, isScroll: true })
  }

  showTokens = (e) => {
    this.setState({ open: true })
  }

  hideTokens = (e) => {
    this.setState({ open: false, searchWord: "" })
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
        listToken={this.props.listToken}
        listShowToken={this.state.listShowToken}
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
        onListScroll = {this.onListScroll}
      />
    )
  }
}
