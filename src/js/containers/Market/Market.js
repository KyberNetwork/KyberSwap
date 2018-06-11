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
      <div className="market row market-landing">
        <h1 className="market-title">Ethereum Market</h1>
        <div className="market-header row">
          <div className="market-header-left columns large-10">
            <div className="columns large-5 market-search">
              <SearchWord />
            </div>
            <div className="columns large-3 market-choose-currency">
              <Currency />
            </div>
            {/* <div className="columns large-3 market-sort">
              <Currency />              
            </div> */}
            <div className="columns large-1"></div>
            {/* <div className="columns large-4">
              <SortColumn />
            </div> */}
          </div>
          <div className="market-header-right columns large-2">
            <ManageColumn />
          </div>
        </div>
        <div className="market-table columns large-12">
          <MarketTable />
        </div>
        <TradingViewModal />
      </div>
    )
  }
}