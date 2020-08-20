import React from "react"
import Dropdown, { DropdownContent, DropdownTrigger } from "react-simple-dropdown";

export default class QuoteList extends React.Component{
  constructor(props) {
    super(props);

    this.state = { active: false };
  }

  toggle = () => {
    this.setState({ active: !this.state.active })
  };

  renderQuotes() {
    const { currentQuote, quoteSymbols, onClick } = this.props;

    return quoteSymbols.map((quotes, key) => {
      const isActive = quotes.includes(currentQuote);

      if (quotes.length > 1) {
        return this.renderQuoteDropdown(quotes, currentQuote, onClick, isActive);
      }

      return (
        <span key={key} className={`theme__background-55 common__flexbox-center quote_item ${isActive ? "active" : ""}`} onClick={() => onClick(quotes[0])}>
         {quotes[0].replace("WETH", "ETH*")}
        </span>
      )
    })
  }
  
  renderQuoteDropdown(quotes, currentQuote, onClick, isActive) {
    return (
      <div key={quotes[0]} className={`theme__background-55 common__flexbox-center quote_item ${isActive ? "active" : ""}`}>
        <Dropdown active={this.state.active} onHide={this.toggle}>
        <DropdownTrigger onClick={this.toggle}>
          <span>{isActive ? currentQuote : quotes[0]}</span>
          <span className="drop-down">
          <img src={require("../../../../assets/img/v3/price_drop_down.svg")}/>
        </span>
        </DropdownTrigger>
        <DropdownContent>
          <div className="quote-filter-modal theme__background theme__text-3">
            <div className="quote-filter-modal__advance">
              {quotes.map(i =>
                <label className="quote-filter-modal__option" key={i} onClick={() => {this.toggle(); onClick(i)}}>{i}</label>
              )}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
      </div>
    )
  }

  render() {
    const { currentQuote, onClick } = this.props;

    return (
      <div id="quote_panel">
        <div className={`theme__background-55 common__flexbox-center quote_item_2 ${currentQuote === "FAV"  ? "active" : ""}`}>
          <div key={"FAV"} className={`star star--title ${currentQuote === "FAV"  ? "active" : ""}`} onClick={() => onClick(currentQuote === "FAV" ? 'WETH' : 'FAV')}/>
        </div>

        {this.renderQuotes()}
      </div>
    )
  }
}
