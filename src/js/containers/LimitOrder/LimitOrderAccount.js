import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { ImportAccount, ErrorModal } from "../ImportAccount";
import { ImportAccountView } from '../../components/ImportAccount'
import { TopBalance, AccountBalance } from "../TransactionCommon";

import * as limitOrderActions from "../../actions/limitOrderActions";

@connect((store, props) => {
	const account = store.account.account;
	const translate = getTranslate(store.locale);
	const tokens = store.tokens.tokens;
	const limitOrder = store.limitOrder;
  const ethereum = store.connection.ethereum;
  const global = store.global;

	return {
		translate,
		limitOrder,
		tokens,
		account,
    ethereum,
    global
	};
})
export default class LimitOrderAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      isAdvanceTokenVisible: false
    }
  }

	selectTokenBalance = () => {
		this.props.dispatch(limitOrderActions.setIsSelectTokenBalance(true));
  };
  
  toggleAdvanceTokeBalance = () => {
    this.setState({
      isAdvanceTokenVisible: !this.state.isAdvanceTokenVisible
    });
  }

	render() {
		if (this.props.account === false) {
			return (
				<div className={"limit-order-account"}>
          <ImportAccountView  
            isAgreedTermOfService={this.props.global.termOfServiceAccepted}
            isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
            errorModal={<ErrorModal />}
            translate={this.props.translate}
            onMobile={this.props.global.onMobile}
            tradeType={"limit_order"}
            />
				</div>
			);
		} else {
			return (
				<div className={"limit-order-account"}>
					<TopBalance
						showMore={this.toggleAdvanceTokeBalance}
						chooseToken={this.props.chooseToken}
						activeSymbol={this.props.limitOrder.sourceTokenSymbol}
						screen="limit_order"
						selectTokenBalance={this.selectTokenBalance}
            changeAmount={limitOrderActions.inputChange}
            changeFocus={limitOrderActions.focusInput}
					/>

          {this.state.isAdvanceTokenVisible && <div className="limit-order-account__advance">
            <div className="advance-close" onClick={e =>this.toggleAdvanceTokeBalance()}>
              <div className="advance-close_wrapper"></div>
            </div>
            <AccountBalance 
              chooseToken={this.props.chooseToken}
              sourceActive={this.props.limitOrder.sourceTokenSymbol}
              isBalanceActive={this.state.isAdvanceTokenVisible}
              // destTokenSymbol
              isOnDAPP={this.props.account.isOnDAPP}
              walletName={this.props.account.walletName}
              screen="limit_order"
              selectTokenBalance={this.selectTokenBalance}
              changeAmount={limitOrderActions.inputChange}
              changeFocus={limitOrderActions.focusInput}
            />
          </div>}
          
				</div>
			);
		}
	}
}
