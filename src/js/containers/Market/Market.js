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
      <div className="market row">
        <div className="market-header columns large-12">
          <div className="market-header-left columns large-8">
            <div className="columns large-4">
              <SearchWord />
            </div>
            <div className="columns large-4">
              <Currency />
            </div>
            {/* <div className="columns large-4">
              <SortColumn />
            </div> */}
          </div>
          <div className="market-header-right columns large-4">
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