import React from "react"
import { connect } from "react-redux"
import {TransferBody} from "../Transfer"
import { getTranslate } from 'react-localize-redux'
import * as validators from "../../utils/validators"
import * as transferActions from "../../actions/transferActions"
import EthereumService from "../../services/ethereum/ethereum"
import constants from "../../services/constants"
import { hideSelectToken } from "../../actions/utilActions";
import * as globalActions from "../../actions/globalActions";
import * as common from "../../utils/common";

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const transfer = store.transfer
  const analytics = store.global.analytics

  return {
    translate, transfer, tokens, account, analytics,
    params: {...props.match.params}
  }
})

export default class Exchange extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isAnimation: false,
      intervalGroup : []
    }
  }
  getEthereumInstance = () => {
    var ethereum = this.props.ethereum
    if (!ethereum){
      ethereum = new EthereumService()
    }
    return ethereum
  }

  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])
    }
    this.setState({intervalGroup: []})
  }

  setInterValGroup = (callback, intervalTime) => {
    callback()
    var intevalProcess = setInterval(callback, intervalTime)
    this.state.intervalGroup.push(intevalProcess)
  }

  fetchGasTransfer = () => {
    if (!this.props.account) {
      return
    }
    var ethereum = this.getEthereumInstance()
    this.props.dispatch(transferActions.estimateGasTransfer(ethereum))
  }

  verifyTransfer = () => {
    if (!this.props.account) {
      return
    }
    this.props.dispatch(transferActions.verifyTransfer())
  }

  setInvervalProcess = () => {
    this.setInterValGroup( this.fetchGasTransfer, 10000)
    this.setInterValGroup( this.verifyTransfer, 3000)
  }


  setAnimation = () => {
    this.setState({isAnimation: true})
  }


  componentDidMount = () =>{
    this.setInvervalProcess()
    if (this.props.params.source.toLowerCase() !== this.props.transfer.tokenSymbol.toLowerCase()){

      var sourceSymbol = this.props.params.source.toUpperCase()
      var sourceAddress = this.props.tokens[sourceSymbol].address

      this.props.dispatch(transferActions.selectToken(sourceSymbol, sourceAddress))
    }
  }

  validateSourceAmount = (value, gasPrice) => {
    if (isNaN(parseFloat(value))) {
    } else {
      var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, this.props.transfer.decimals)
      if (amountBig.isGreaterThan(this.props.transfer.balance)) {
        this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.input, this.props.translate("error.amount_transfer_too_hign")))
        return
      }

      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance,
        this.props.transfer.tokenSymbol, this.props.transfer.amount, this.props.transfer.gas, gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance, this.props.translate("error.eth_balance_not_enough_for_fee")))
      }
    }
    this.props.dispatch(transferActions.seSelectedGas(level))
    this.specifyGasPrice(value)
    this.props.analytics.callTrack("trackChooseGas", "transfer", value, level);
  }

  setSrcToken = (symbol, address, type) => {
    this.props.dispatch(transferActions.selectToken(symbol, address));
    this.props.dispatch(hideSelectToken());

    let path = constants.BASE_HOST + "/transfer/" + symbol.toLowerCase();
    path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED);

    this.props.dispatch(globalActions.goToRoute(path));
    this.props.analytics.callTrack("trackChooseToken", type, symbol);
  };

  render() {
    return (
      <div className={"exchange__container"}>
        <TransferBody setSrcToken={this.setSrcToken}/>
      </div>
    )
  }
}
