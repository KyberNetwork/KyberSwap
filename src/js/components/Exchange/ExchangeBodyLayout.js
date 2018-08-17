import React from "react"
import { NavLink } from 'react-router-dom'
import { roundingNumber, toEther } from "../../utils/converter"
import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { AccountBalance } from "../../containers/TransactionCommon";
import { PostExchangeWithKey } from "../../containers/Exchange";
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";
import { Line } from 'react-chartjs-2';

const ExchangeBodyLayout = (props) => {

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
  }

  var errorSelectSameToken = props.errors.selectSameToken !== '' ? props.translate(props.errors.selectSameToken) : ''
  var errorSelectTokenToken = props.errors.selectTokenToken !== '' ? props.translate(props.errors.selectTokenToken) : ''
  var errorToken = errorSelectSameToken + errorSelectTokenToken

  var maxCap = props.maxCap
  var errorSource = []
  var errorExchange = false
  if (props.errorNotPossessKgt !== "") {
    errorSource.push(props.errorNotPossessKgt)
    errorExchange = true
  } else {
    if (props.errors.exchange_enable !== "") {
      errorSource.push(props.translate(props.errors.exchange_enable))
      errorExchange = true
    } else {
      if (errorToken !== "") {
        errorSource.push(errorToken)
        errorExchange = true
      }
      if (props.errors.sourceAmount !== "") {
        if (props.errors.sourceAmount === "error.source_amount_too_high_cap") {
          if (props.sourceTokenSymbol === "ETH") {
            errorSource.push(props.translate("error.source_amount_too_high_cap", { cap: maxCap }))
          } else {
            errorSource.push(props.translate("error.dest_amount_too_high_cap", { cap: maxCap * constants.MAX_CAP_PERCENT }))
          }
        } else if (props.errors.sourceAmount === "error.source_amount_too_small") {
          errorSource.push(props.translate("error.source_amount_too_small", {minAmount: toEther(constants.EPSILON)}))
        } else {
          errorSource.push(props.translate(props.errors.sourceAmount))
        }
        errorExchange = true
      }
      if (props.errors.rateSystem !== "") {
        errorSource.push(props.translate(props.errors.rateSystem))
        errorExchange = true
      }
    }
  }

  var errorShow = errorSource.map((value, index) => {
    return <span class="error-text" key={index}>{value}</span>
  })

  var classSource = "amount-input"
  if (props.focus === "source") {
    classSource += " focus"
  }
  if (errorExchange) {
    classSource += " error"
  }

  const chartRanges = ['1D', '1W', '1M', 'All'];
  var chartRangeHtml = chartRanges.map((value, index) => {
    return <div className={"balance-content__range-item" + (props.chart.timeRange == value ? ' balance-content__range-item--active' : '')} key={index} onClick={() => props.changeChartRange(value)}>{value}</div>
  })

  const isNegativeChange = props.chart.tokenChange < 0;

  const data = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    datasets: [{
      data: [0.00023890315313575633, 0.0002410515240672516, 0.00024232294837384034, 0.00023674319766227563, 0.0002334445187770264, 0.00023714592042686645, 0.00024970635345897724, 0.00025016936382416937, 0.00025130158200639246, 0.0002538215460731078, 0.0002489903957961095, 0.00024758197256755294, 0.00024792595885640657, 0.000246373640359363, 0.0002464989119781937, 0.00024291638952263689, 0.0002475784636653132, 0.00025805578428904336, 0.00025178636601556285, 0.0002498348946964259, 0.00025293152927042677, 0.000243523494193389, 0.0002394060317371602, 0.00024677911489950184, 0.00024637583891663246, 0.00024479595317007164, 0.00023890446616952203, 0.0002351395207161765],
      backgroundColor: isNegativeChange ? 'rgba(255, 99, 132, 0.2)' : 'rgba(49, 203, 158, 0.2)',
      borderColor: isNegativeChange ? 'rgba(255,99,132,1)': '#31CB9E',
      borderWidth: 1
    }]
  };

  const options = {
    elements: {
      point: {
        radius: 0
      }
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false,
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }]
    }
  }

  var render = (
    <div className="grid-x">
      <div className={"cell medium-6 large-3 balance-wrapper" + (errorExchange ||  props.networkError?" error":"")} id="balance-account-wrapper">
        <div className="balance-content">
          <SlideDown active={props.chart.isActive}>
            <SlideDownTrigger onToggleContent={() => props.toggleChartContent()}>
              <div className="balance-content__pair">
                {props.chart.tokenSymbol}/ETH
              </div>
              <div className="balance-content__rate-wrapper">
                <div className="balance-content__rate">0.000392</div>
                <div className={"balance-content__change" + (isNegativeChange ? ' balance-content__change--nagative' : '')}>
                  {props.chart.tokenChange}%
                </div>
              </div>
            </SlideDownTrigger>

            <SlideDownContent>
              <div className={"balance-content__chart" + (props.chart.isLoading ? ' balance-content__chart--loading' : '')}>
                <Line
                  data={data}
                  options={options}
                  height={200}
                />
              </div>
              <div className="balance-content__range">{chartRangeHtml}</div>
            </SlideDownContent>
          </SlideDown>
        </div>

        {props.account !== false && (
          <AccountBalance
            chooseToken = {props.chooseToken}
            sourceActive = {props.sourceTokenSymbol}
          />
        )}
      </div>

      <div className={"cell medium-6 large-9 swap-wrapper" +
        (props.isAgreed ? ' swap-wrapper--agreed' : '') + (props.account !== false ? ' swap-wrapper--imported' : '')}>
        <div className="grid-x exchange-col">
          <div className="cell large-8 exchange-col-1">
            <div className={"swap-content" +
              (props.isAgreed ? ' swap-content--agreed' : '') + (props.account !== false ? ' swap-content--imported' : '')}>
              {props.networkError !== "" && (
                <div className="network_error">
                <span>
                  <img src={require("../../../assets/img/warning.svg")} />
                </span>
                  <span>
                  {props.networkError}
                </span>
                </div>
              )}
              <div className="title main-title">{props.translate("transaction.swap") || "Swap"}</div>
              <div className="grid-x">
                <div className="cell large-5">
                <span className="transaction-label">
                  {props.translate("transaction.exchange_from").toUpperCase() || "FROM"}
                </span>
                  <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                    {props.tokenSourceSelect}
                    <div className={classSource}>
                      <div>
                        <input id="inputSource" className="source-input" min="0" step="0.000001"
                               placeholder="0" autoFocus
                               type="text" maxLength="50" autoComplete="off"
                               value={props.input.sourceAmount.value}
                               onFocus={props.input.sourceAmount.onFocus}
                               onBlur={props.input.sourceAmount.onBlur}
                               onChange={handleChangeSource}
                        />
                      </div>
                      <div>
                        <span>{props.sourceTokenSymbol}</span>
                      </div>
                    </div>
                  </div>
                  <div className={errorExchange ? "error" : ""}>
                    {errorShow}
                  </div>
                </div>

                <div class="cell large-2 exchange-icon">
                <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                  <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
                </span>
                  <ReactTooltip place="bottom" id="swap" type="light" />
                </div>

                <div className="cell large-5 exchange-col-1-2">
                <span className="transaction-label">
                  {props.translate("transaction.exchange_to").toUpperCase() || "TO"}
                </span>
                  <div className="select-token-panel">

                    {props.tokenDestSelect}

                    <div className={props.focus === "dest" ? "amount-input focus" : "amount-input"}>
                      <div>
                        <input className="des-input" step="0.000001" placeholder="0" min="0"
                               type="text" maxLength="50" autoComplete="off"
                               value={props.input.destAmount.value}
                               onFocus={props.input.destAmount.onFocus}
                               onBlur={props.input.destAmount.onBlur}
                               onChange={handleChangeDest} />
                      </div>
                      <div>
                        <span>{props.destTokenSymbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="large-6">
                {props.addressBalanceLayout}
              </div>

              <div className="swap-button-wrapper">
                <PostExchangeWithKey/>

                {props.account === false && (
                  <ImportAccount/>
                )}
              </div>
            </div>
          </div>
          <div className="cell large-4 exchange-col-2">
            {props.advanceLayout}
          </div>
        </div>
      </div>
    </div>
  )
  return (

    <div id="exchange">
      {render}
      {props.transactionLoadingScreen}
    </div>
  )
}

export default ExchangeBodyLayout
