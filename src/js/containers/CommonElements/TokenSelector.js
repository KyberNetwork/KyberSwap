import React from "react"
import { connect } from "react-redux"
import { TokenSelectorView } from '../../components/CommonElement'
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
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

  toggleOpen = (e) => {
    this.setState({ open: !this.state.open })
  }
  selectItem = (event, symbol, address) => {
    this.props.chooseToken(symbol, address, this.props.type)
    this.setState({ open: false })
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
      />
    )
  }
}
