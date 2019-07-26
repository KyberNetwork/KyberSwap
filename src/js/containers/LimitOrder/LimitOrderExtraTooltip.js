import React from 'react'
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import { subOfTwoNumber, formatNumber } from "../../utils/converter";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder
  }
})
export default class LimitOrderExtraTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ele = null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside, null);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, null);
  }

  handleClickOutside = (e) => {
    if (this.ele.contains(e.target)) {
      return
    }

    this.props.toggleExtraModal(null);
  }

  render() {
    let extraAmount = subOfTwoNumber(this.props.actualAmount, this.props.estimateAmount);
    extraAmount = formatNumber(extraAmount, 5);

    return (
      <div className="extra-tooltip" ref={e => this.ele = e}>
        <div>
          {this.props.translate("limit_order.actual_receive_amount") || "Actual receive amount:"}{' '}
          {`${this.props.actualAmount} ${this.props.dest}`} 
        </div>
        <div>
          {this.props.translate("limit_order.estimated_amount") || "Estimated amount:"}{' '}
          {`${this.props.estimateAmount} ${this.props.dest}`} 
        </div>
        <div>
          {this.props.translate("limit_order.extra_amount") || "You got extra amount:"}{' '}
          <span className="extra-tooltip--extra-amount">
            {`${extraAmount} ${this.props.dest}`}
          </span>
        </div>
        <div className="extra-tooltip--faq">
          <a href={`/faq#Why-received-amount-is-higher-than-estimated-amount`} target="_blank">
            {this.props.translate("why") || "Why?"}
          </a>
        </div> 
      </div>
    )
  }
}
