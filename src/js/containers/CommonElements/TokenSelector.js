import React from "react"
import { connect } from "react-redux"
import { TokenSelectorView } from '../../components/CommonElement'

@connect((store, props) => {
  return {
    focusItem: props.focusItem,
    listItem: props.listItem,
    type : props.type,
    chooseToken: props.chooseToken
  }
})

export default class TokenSelector extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			open: false,
      searchWord: "",
      //listItem: props.listItem
    }
  }

  changeWord = (e) => {
    var value = e.target.value.toLowerCase()
    // var listItem = {}
    // Object.keys(this.props.listItem).map((key, i) => {
    //   if (this.props.listItem[key].name.toLowerCase().includes(value)){
    //     listItem[key] = this.props.listItem[key]
    //   }
    // })
    this.setState({searchWord: value})
  }

  toggleOpen = (e)=>{
    this.setState({open: !this.state.open})
  }
  selectItem = (event, symbol, address) => {
    this.props.chooseToken(symbol, address, this.props.type)
    this.setState({open: false})
  }
  // closeModal = (event) => {
  //   this.props.dispatch(hideSelectToken())
  // }
  // chooseToken = (event, symbol, address, type) => {
  //   this.props.chooseToken(symbol, address, type)
  // }


  render() {
    return (
      <TokenSelectorView
        open = {this.state.open}
        searchWord = {this.state.searchWord}

        listItem = {this.props.listItem}
        focusItem = {this.props.focusItem}
        toggleOpen = {this.toggleOpen}
        changeWord = {this.changeWord}
        selectItem = {this.selectItem}
        // onRequestClose={this.closeModal}
        // type={this.props.modalInfo.type}
        // tokens={this.props.tokens}
        // chooseToken={this.chooseToken}
        // selected={this.props.modalInfo.selected}
        // closeModal={this.closeModal}
        // translate={this.props.translate}
      />

    )
  }
}
