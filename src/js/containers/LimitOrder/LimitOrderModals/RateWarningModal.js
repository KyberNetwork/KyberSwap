import React, { Component } from 'react';
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import ReactTable from "react-table";

import { Modal } from "../../../components/CommonElement";
import { LimitOrderSubmit } from "../../LimitOrder";

@connect((store, props) => {
	const translate = getTranslate(store.locale);
	const limitOrder = store.limitOrder;
	const global = store.global;
	const account = store.account.account;

	return {
		translate,
		limitOrder,
		global,
		account
	};
})
export default class RateWarningModal extends Component {
  contentModal = () => {
    return (
      <div className="limit-order-modal">
        <div className="limit-order-modal__body">
          <div className="limit-order-modal__title">
            {this.props.translate("limit_order.submit_order") || "Submit Order"}
          </div>
          
					<div
						className="limit-order-modal__close"
						onClick={e => this.closeModal()}
					>
						<div className="limit-order-modal__close-wrapper" />
					</div>

          {/* Body */}
          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message">
              <div className="rate-warning-tooltip__description">
                {this.props.translate("limit_order.rate_warning_title") || `By submitting this order, you also CANCEL the following orders:`}
              </div>
              <span className="rate-warning-tooltip__faq">
                <a href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
                  {this.props.translate("why") || "Why?"}
                </a>
              </span>
            </div>

            {/* Table */}
            <div className="rate-warning-tooltip__order-container">
              {this.props.getListWarningOrdersComp()}
            </div>

            <div className="rate-warning-tooltip__footer">
              <label className="rate-warning-tooltip__confirm">
                <span className="rate-warning-tooltip__confirm--text">
                  {this.props.translate("i_understand") || "I understand"}
                </span>
                <input type="checkbox" 
                  checked={this.props.limitOrder.isAgreeForceSubmit}
                  className="rate-warning-tooltip__confirm--checkbox"
                  onChange={e => this.props.toggleAgreeSubmit()}/>
                <span className="rate-warning-tooltip__confirm--checkmark"></span>
              </label>
            </div>

          </div>
        
          {/* Submit button */}
          <LimitOrderSubmit
            availableBalanceTokens={this.props.availableBalanceTokens}
            getOpenOrderAmount={this.props.getOpenOrderAmount}
            setSubmitHandler={this.props.setSubmitHandler}
            hideTermAndCondition={true}
          />
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.props.closeRateWarningTooltip();
  }

  render() {
    return (
      <Modal
				className={{
					base: "reveal medium confirm-modal",
					afterOpen:
						"reveal medium confirm-modal"
				}}
				isOpen={this.props.isOpen}
				onRequestClose={this.closeModal}
				contentLabel="Rate Warning Modal"
				content={this.contentModal()}
				size="medium"
			/>
    )
  }
}
