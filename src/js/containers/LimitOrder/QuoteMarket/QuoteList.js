import React from "react"
import Dropdown, {DropdownContent, DropdownTrigger} from "react-simple-dropdown";
export default class QuoteList extends React.Component{
  constructor(){
    super()
    this.state = {}
    this.dropdownQuotes = ["DAI", "TUSD", "USDC"]
  }
  renderDropdown(){
    const { quotes, currentQuote, onClick } = this.props
    const temp = quotes.filter(i => this.dropdownQuotes.includes(i))
    return (
      <div className={`theme__background-55 quote_item ${this.dropdownQuotes.includes(currentQuote) ? "active" :""}`}><Dropdown>
        <DropdownTrigger>
          <span>{this.dropdownQuotes.includes(currentQuote) ? currentQuote : temp[0]}</span>
          <span className="drop-down">
          <img src={require("../../../../assets/img/v3/price_drop_down.svg")}/>
        </span>
        </DropdownTrigger>
        <DropdownContent>
          <div className="quote-filter-modal theme__background theme__text-3">
            <div className="quote-filter-modal__advance">
              {quotes.filter(i => this.dropdownQuotes.includes(i)).map(i => <label onClick={() => onClick(i)} className="quote-filter-modal__option">{i}</label>)}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
      </div>
      // return <div className={`quote_item ${this.dropdownQuotes.includes(currentQuote) ? "active" :""}`}>
      //   <select className="theme__text-3" onChange={ (e) => onClick(e.target.value)} value={currentQuote}>{temp.map(i => <option>{i}</option>)}</select>
      // </div>
    )

  }

  render() {
    const { currentQuote, quotes, onClick } = this.props
    return (
      <div id="quote_panel">
        <div className={`theme__background-55 quote_item_2 ${currentQuote === "FAV"  ? "active" : ""}`}><div key={"FAV"} className={`star star--title ${currentQuote === "FAV"  ? "active" : ""}`} onClick={() => onClick("FAV")}/></div>
        {this.renderDropdown()}
        { quotes.filter(i => !this.dropdownQuotes.includes(i)).map(i => {
              return <span key={i} className={`theme__background-55 text-center quote_item ${currentQuote === i ? "active" :""}`} onClick={() => onClick(i)}>{i.replace("WETH", "ETH*")}</span>
          })
        }
      </div>
    )
  }
}
