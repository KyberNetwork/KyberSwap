import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux'
import { Currency, ManageColumn, MarketTable, SearchWord, SortColumn, TradingViewModal } from "../Market"


@connect((store) => {

  return {
    translate: getTranslate(store.locale),
  }
})

export default class Market extends React.Component {

  render() {
    return (
      <div className="market container">
        <h1 className="market__title">Ethereum Market</h1>
        <div className="market__header">
          <div className="market__header-left">
            <div className="market__header-search"><SearchWord /></div>
            <div className="market__header-currency"><Currency /></div>
          </div>
          <div className="market__header-right"><ManageColumn /></div>
        </div>
        <div className="market-table">
            <div>
              <MarketTable />
            </div>
        </div>
        <TradingViewModal />
      </div>
    )
  }
}