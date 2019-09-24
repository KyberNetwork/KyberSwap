import React, { Component } from 'react';
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { Modal } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import limitOrderServices from "../../../services/limit_order";
import * as common from "../../../utils/common";
import * as converters from "../../../utils/converter";
import {LIMIT_ORDER_CONFIG} from "../../../services/constants";
import BLOCKCHAIN_INFO from "../../../../../env";

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
export default class OrderDetailsModal extends Component {
    contentModal = () => {
        const { order } = this.props
        let source = order.source == "WETH" ? "ETH*" : order.source
        let dest = order.dest == "WETH" ? "ETH*" : order.dest

        const { min_rate, fee, src_amount, status } = order;
        let destAmount = converters.multiplyOfTwoNumber(src_amount, converters.multiplyOfTwoNumber(min_rate, converters.subOfTwoNumber(1, fee))); // fee already in percentage format
        return (
            <div className="limit-order-modal">
                <div className="limit-order-modal__body">
                    <div className="limit-order-modal__title">
                        { `${order.side_trade} ${source} Order`}
                    </div>

                    <div className="limit-order-modal__close"
                        onClick={e => this.closeModal()}>
                        <div className="limit-order-modal__close-wrapper" />
                    </div>
                    <div className="limit-order-modal__content">
                        <div className="limit-order-modal__message">
                            {common.getFormattedDate(order.updated_at)} {' '}
                                <span className={`cell-status cell-status--${order.status}`}>
                                    {(order.status)}
                                </span>
                        </div>
                        <div className={"order-table-info"}>
                            <div className={"order-table-info__header"}>
                                <div>{"Pair"}</div>
                                <div>{"Price"}</div>
                                <div>{"Amount"}</div>
                                <div>{"Total"}</div>
                                <div>{"Fee"}</div>
                                <div>{"Action"}</div>
                            </div>
                            <div className={"order-table-info__body"}>
                                <div className={"info"}>
                                    <div>{`${order.source.toUpperCase()}/${order.dest.toUpperCase()}`}</div>
                                    <div>{converters.displayNumberWithDot(order.min_rate, 9)}</div>
                                    <div>{`${converters.formatNumber(order.src_amount, 5)} ${order.source.toUpperCase()}`} </div>
                                    <div>{`${converters.formatNumber(destAmount, 5)} ${dest.toUpperCase()}`}</div>
                                    <div>{converters.formatNumber(converters.multiplyOfTwoNumber(fee, src_amount), 5, '')}</div>
                                    <div className="cell-action">
                                        {status === LIMIT_ORDER_CONFIG.status.OPEN && <button className="btn-cancel-order theme__button-2" onClick={e =>this.confirmCancel()}>{this.props.translate("limit_order.cancel") || "Cancel"}</button>}
                                        {status === LIMIT_ORDER_CONFIG.status.FILLED && <button className="btn-cancel-order btn-cancel-order--view-tx theme__button-2" onClick={e => window.open(BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + order.tx_hash)}>{this.props.translate("limit_order.view_tx") || "View tx"}</button>}
                                        {status !== LIMIT_ORDER_CONFIG.status.OPEN && status !== LIMIT_ORDER_CONFIG.status.FILLED && this.props.screen !== "mobile" && <div className="line-indicator"></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="limit-order-modal__message">
                                <div>Address</div>
                                <div>{order.user_address}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="limit-order-modal__body"></div>


            </div>
        )
    }

    closeModal = () => {
        this.props.closeModal();
    }

    async confirmCancel() {
        this.props.global.analytics.callTrack("trackClickConfirmCancelOrder", this.props.order ? this.props.order.id : null);
        if (this.props.order) {
            try {
                const results = await limitOrderServices.cancelOrder(
                    this.props.order
                );
                if (results) {
                    if (this.props.limitOrder.filterMode === "client") {
                        this.props.dispatch(limitOrderActions.updateOpenOrderStatus());
                    } else {
                        this.props.dispatch(limitOrderActions.getOrdersByFilter({}));

                        if (this.props.account) {
                            this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address));
                        }
                    }
                    this.props.dispatch(limitOrderActions.getListFilter());
                }
            } catch (err) {
                console.log(err);
            }
        }
        this.props.closeModal();
    }

    render() {
        return (
            this.props.order && <Modal
                className={{
                    base: "reveal medium confirm-modal",
                    afterOpen:
                        "reveal medium confirm-modal"
                }}
                isOpen={this.props.isOpen}
                onRequestClose={this.closeModal}
                contentLabel="Order Details"
                content={this.contentModal()}
                size="medium"
            />
        )
    }
}
