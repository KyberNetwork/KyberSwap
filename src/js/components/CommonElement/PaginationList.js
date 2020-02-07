import React from "react"

export default class PaginationList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      page: 4
    };
  }
  
  changeToPreviousPage() {
    const page = this.state.page - 1;
    this.changePage(page);
  }
  
  changeToNextPage() {
    const page = this.state.page + 1;
    this.changePage(page);
  }
  
  changePage(page) {
    this.setState({page});
    this.props.onPageChanged();
  }
  
  renderPreviousPages() {
    let pages = [];
    
    for(let i = 1; i < this.state.page && i <= 2; i++) {
      pages.push(<div className="common__pagination-item" onClick={() => this.changePage(i)}>{i}</div>)
    }
  
    if (this.state.page >= 4) {
      const previousPage = this.state.page - 1;
      pages.push(<div className="common__pagination-item common__pagination-item--inactive">...</div>)
      pages.push(<div className="common__pagination-item" onClick={() => this.changePage(previousPage)}>{previousPage}</div>)
    }
    
    return pages;
  }
  
  renderNextPages() {
    let pages = [];
    let nextPages = this.state.page + 1;
    const pageDifference = this.props.total - this.state.page;
    
    if (pageDifference >= 3) {
      pages.push(<div className="common__pagination-item" onClick={() => this.changePage(nextPages)}>{nextPages}</div>)
      pages.push(<div className="common__pagination-item common__pagination-item--inactive">...</div>)
      nextPages = this.props.total - 1;
    }
    
    for(let i = nextPages; i <= this.props.total; i++) {
      pages.push(<div className="common__pagination-item" onClick={() => this.changePage(i)}>{i}</div>)
    }
    
    return pages;
  }
  
  render() {
    return (
      <div className={`common__pagination ${this.props.loading ? 'common__pagination--disabled' : ''}`}>
        <div
          className={`common__pagination-item ${this.state.page === 1 ? 'common__pagination-item--disabled' : ''}`}
          onClick={() => this.changeToPreviousPage()}
        >
          &lt; Previous
        </div>
        
        {this.state.page > 1 && this.renderPreviousPages()}
        
        <div className={`common__pagination-item common__pagination-item--active`}>{this.state.page}</div>
  
        {this.state.page < this.props.total && this.renderNextPages()}
        
        <div
          className={`common__pagination-item ${this.state.page === this.props.total ? 'common__pagination-item--disabled' : ''}`}
          onClick={() => this.changeToNextPage()}
        >
          Next &gt;
        </div>
      </div>
    )
  }
}