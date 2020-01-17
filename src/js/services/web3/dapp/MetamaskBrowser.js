import DappBrowser from "./DappBrowser"

export default class MetamaskBrowser extends DappBrowser {
    getWalletType = () => {
        return "metamask"
    }

    getWalletName = () => {
        return 'Metamask';
    }
}