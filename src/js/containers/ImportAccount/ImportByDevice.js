import React from "react"
import { connect } from "react-redux"
import AddressGenerator from "../../services/addressGenerator";
import { ImportByDeviceView } from "../../components/ImportAccount"
import { importNewAccount, importLoading, closeImportLoading, throwError, checkTimeImportLedger, resetCheckTimeImportLedger } from "../../actions/accountActions"
import { toEther } from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'
import { PAGING } from "../../services/constants";

@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    account: store.account,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics,
    theme: store.global.theme
  }
}, null, null, {forwardRef: true})

export default class ImportByDevice extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      addresses: [],
      currentAddresses: [],
      modalOpen: false,
      isFirstList: true,
      isLoading: false,
      selectedPath: props.defaultPath
    }
    
    this.setDeviceState();

    this.DPATH = props.dpaths;
  }

  setDeviceState() {
    this.addressIndex = 0;
    this.currentIndex = 0;
    this.walletType = 'trezor';
    this.generator = null;
  }

  updateBalance() {
    this.interval = setInterval(() => {
      this.state.addresses.forEach((address, index) => {
        this.addBalance(address.addressString, index);
      })
    }, 10000)
  }

  connectDevice(walletType, dpath = this.props.defaultPath) {
    this.setDeviceState();

    if (!this.props.deviceService) {
      this.props.dispatch(throwError("cannot find device service"))
      return
    }

    this.props.deviceService.getPublicKey(dpath.value, this.state.modalOpen)
      .then((result) => {
        this.openModal();
        this.setState({ selectedPath: dpath })

        this.generateAddress(result, dpath);
        this.props.dispatch(closeImportLoading());
      })
      .catch((err) => {
        err = err.toString() === "Error: Not a valid path." ? "Not a valid path" : err
        this.props.dispatch(throwError(err))
        this.props.dispatch(closeImportLoading());
        if(this.walletType == 'ledger'){
          clearTimeout(this.ledgerLoading);
          this.props.dispatch(resetCheckTimeImportLedger())
        }
      })
    this.walletType = walletType;
  }

  async generateAddress(data, dpath) {
    this.generator = new AddressGenerator(data, dpath, this.props.deviceService.getPublicKey);

    let addresses = [];
    let index = 0;

    this.setState({ isLoading: true });

    for (index; index < PAGING.ADDRESS; index++) {
      let address = {
        addressString: await this.generator.getAddressString(index),
        index: index,
        balance: -1,
      };
      addresses.push(address);
    }

    this.setState({ isLoading: false });

    addresses.forEach((address, index) => {
      this.addBalance(address.addressString, index);
    })

    this.addressIndex = index;
    this.currentIndex = index;

    this.setState({
      addresses: addresses,
      currentAddresses: addresses
    })
  }

  openModal() {
    if(this.walletType == 'ledger'){
      clearTimeout(this.ledgerLoading);
      this.props.dispatch(resetCheckTimeImportLedger())
    }
    this.setState({
      modalOpen: true,
    })

    this.updateBalance();

    this.props.analytics.callTrack("trackOpenModalColdWallet", this.walletType);
  }

  closeModal() {
    this.setState({
      modalOpen: false,
    })
    clearInterval(this.interval);
    this.props.analytics.callTrack("trackClickCloseModal", this.walletType);
  }

  async moreAddress() {
    let addresses = this.state.addresses,
      i = this.addressIndex,
      j = i + PAGING.ADDRESS,
      currentAddresses = [];

    if (this.generator) {
      this.setState({ isLoading: true });

      if (this.addressIndex == this.currentIndex) {
        for (i; i < j; i++) {
          let address = {
            addressString: await this.generator.getAddressString(i),
            index: i,
            balance: -1,
          };
          addresses.push(address);
          currentAddresses.push(address);
        }
      }

      this.setState({ isLoading: false });

      addresses.forEach((address, index) => {
        this.addBalance(address.addressString, index);
      })

      this.addressIndex = i;
      this.currentIndex += PAGING.ADDRESS;
      this.setState({
        addresses: addresses,
        currentAddresses: addresses.slice(this.currentIndex - PAGING.ADDRESS, this.currentIndex)
      })
      if (this.state.isFirstList) {
        this.setState({
          isFirstList: false
        })
      }
    } else {
      this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
    }
    this.props.analytics.callTrack("trackClickGetMoreAddressDevice");
  }

  preAddress() {
    let addresses = this.state.addresses;
    if (this.currentIndex > PAGING.ADDRESS) {
      this.currentIndex -= PAGING.ADDRESS;
      this.setState({
        currentAddresses: addresses.slice(this.currentIndex - PAGING.ADDRESS, this.currentIndex),
      })
    }
    if (this.currentIndex <= PAGING.ADDRESS) {
      this.setState({
        isFirstList: true
      })
    }
    this.props.analytics.callTrack("trackClickGetPreAddressDevice");
  }

  getAddress(data) {
    this.props.dispatch(importNewAccount(data.address, data.type, data.path, this.props.ethereumNode, this.props.screen));
    this.closeModal()
  }

  choosePath(dpath) {
    this.closeModal();
    this.props.dispatch(importLoading());
    this.connectDevice(this.walletType, dpath);
  }

  getBalance(address) {
    return new Promise((resolve, reject) => {
      this.props.ethereumNode.call("getBalanceAtLatestBlock",address).then(balance => {
        resolve(toEther(balance))
      }).catch(err => console.log)
    })
  }

  addBalance(address, index) {
    this.getBalance(address).then((result) => {
      let addresses = this.state.addresses;
      addresses[index].balance = result
      this.setState({
        currentList: addresses
      })
    })
  }

  showLoading(walletType) {
    this.props.dispatch(resetCheckTimeImportLedger())
    if (walletType == 'ledger') {
      this.props.dispatch(importLoading());
      this.connectDevice(walletType);
      this.ledgerLoading = setTimeout(() => {
        this.props.dispatch(checkTimeImportLedger())
      }, 6000);
    } else {
      this.props.dispatch(importLoading());
      this.connectDevice(walletType);
    }
  }

  render() {
    return (
      <ImportByDeviceView
        content={this.props.content}
        modalOpen={this.state.modalOpen}
        isFirstList={this.state.isFirstList}
        onRequestClose={this.closeModal.bind(this)}
        getPreAddress={() => this.preAddress()}
        getMoreAddress={() => this.moreAddress()}
        allDPaths={this.DPATH}
        currentDPath={this.state.selectedPath}
        currentAddresses={this.state.currentAddresses}
        walletType={this.walletType}
        getAddress={this.getAddress.bind(this)}
        choosePath={this.choosePath.bind(this)}
        showLoading={this.showLoading.bind(this)}
        translate={this.props.translate}
        analytics={this.props.analytics}
        theme={this.props.theme}
        isLoading={this.state.isLoading}
      />
    )
  }
}
