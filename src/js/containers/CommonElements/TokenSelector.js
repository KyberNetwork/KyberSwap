import React from "react"
import { connect } from "react-redux"
import { TokenSelectorView } from '../../components/CommonElement'
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var listToken = [] 
  Object.keys(props.listItem).map((key, i) => {
    listToken.push(listToken[key])
  })
 
  return {
    account: store.account.account,
    focusItem: props.focusItem,
    listToken: listToken,
    type: props.type,
    chooseToken: props.chooseToken,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class TokenSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searchWord: "",
      numShow: 10,
      displayList: []
    }
  }
  componentDidMount = () => {
    var index = 0
    Object.keys(this.props.listItem).map((key, i) => {

    })
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
        listToken={this.props.listToken}
        focusItem={this.props.focusItem}
        toggleOpen={this.toggleOpen}
        changeWord={this.changeWord}
        selectItem={this.selectItem}
        translate={this.props.translate}
        showTokens = {this.showTokens}
        hideTokens = {this.hideTokens}
        type={this.props.type}
        analytics={this.props.analytics}
      />
    )
  }
}
