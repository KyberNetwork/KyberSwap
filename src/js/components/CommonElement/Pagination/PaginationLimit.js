import React from "react"
import SlideDown, { SlideDownContent, SlideDownTrigger } from "../SlideDown";

export default class PaginationLimit extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isDropdownOpened: false
    };
    
    this.contentRef = null;
  }
  
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside, null);
  }
  
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, null);
  }
  
  toggleDropdown = () => {
    this.setState({ isDropdownOpened: !this.state.isDropdownOpened })
  };
  
  onClickLimit = (limit) => {
    this.toggleDropdown();
    
    if (limit === this.props.limit) return;
    
    this.props.onLimitChanged(limit);
  };
  
  handleClickOutside = (e) => {
    if (this.contentRef.contains(e.target)) {
      return
    }
  
    this.setState({ isDropdownOpened: false })
  };
  
  render() {
    return (
      <div className="common__pagination-limit">
        <span className="common__pagination-limit-text">{this.props.translate('show') || 'Show'}</span>
      
        <div ref={e => this.contentRef = e}>
          <SlideDown active={this.state.isDropdownOpened} className="common__relative">
            <SlideDownTrigger className="common__pagination-limit-dropdown theme__background-4" toggleContent={this.toggleDropdown}>
              <div className="common__pagination-limit-current">{this.props.limit}</div>
              <div className={`common__triangle theme__border-top ${this.state.isDropdownOpened ? 'up' : 'down'}`}/>
            </SlideDownTrigger>
          
            <SlideDownContent className="common__absolute common__full-width">
              <div className="common__pagination-limit-content theme__background-7">
                <div onClick={() => this.onClickLimit(20)}>20</div>
                <div onClick={() => this.onClickLimit(50)}>50</div>
                <div onClick={() => this.onClickLimit(100)}>100</div>
              </div>
            </SlideDownContent>
          </SlideDown>
        </div>
      
        <span className="common__pagination-limit-total">/ {this.props.totalRecords}</span>
      </div>
    )
  }
}