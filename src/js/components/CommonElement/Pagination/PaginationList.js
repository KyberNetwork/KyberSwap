import React from "react"

export default class PaginationList extends React.Component {
  changeToPreviousPage() {
    const page = this.props.currentPage - 1;
    this.props.onPageChanged(page);
  }
  
  changeToNextPage() {
    const page = this.props.currentPage + 1;
    this.props.onPageChanged(page);
  }
  
  renderPreviousPages() {
    let pages = [];
    
    for (let i = 1; i < this.props.currentPage && i <= 2; i++) {
      pages.push(<div key={i} className="common__pagination-item" onClick={() => this.props.onPageChanged(i)}>{i}</div>)
    }
  
    if (this.props.currentPage >= 4) {
      const previousPage = this.props.currentPage - 1;
      pages.push(<div key='previous-more' className="common__pagination-item common__pagination-item--inactive">...</div>)
      pages.push(<div key='previous-page' className="common__pagination-item" onClick={() => this.props.onPageChanged(previousPage)}>{previousPage}</div>)
    }
    
    return pages;
  }
  
  renderNextPages() {
    let pages = [];
    let nextPages = this.props.currentPage + 1;
    const pageDifference = this.props.total - this.props.currentPage;
    
    if (pageDifference >= 3) {
      pages.push(<div key='next-page' className="common__pagination-item" onClick={() => this.changeToNextPage()}>{nextPages}</div>)
      pages.push(<div key='next-more' className="common__pagination-item common__pagination-item--inactive">...</div>)
      nextPages = this.props.total - 1;
    }
    
    for (let i = nextPages; i <= this.props.total; i++) {
      pages.push(<div key={i} className="common__pagination-item" onClick={() => this.props.onPageChanged(i)}>{i}</div>)
    }
    
    return pages;
  }
  
  render() {
    return (
      <div className={`common__pagination ${this.props.loading ? 'common__pagination--disabled' : ''}`}>
        <div
          className={`common__pagination-item ${this.props.currentPage === 1 ? 'common__pagination-item--disabled' : ''}`}
          onClick={() => this.changeToPreviousPage()}
        >
          &lt; Previous
        </div>
        
        {this.props.currentPage > 1 && this.renderPreviousPages()}
        
        <div className={`common__pagination-item common__pagination-item--active`}>{this.props.currentPage}</div>
  
        {this.props.currentPage < this.props.total && this.renderNextPages()}
        
        <div
          className={`common__pagination-item ${this.props.currentPage === this.props.total ? 'common__pagination-item--disabled' : ''}`}
          onClick={() => this.changeToNextPage()}
        >
          Next &gt;
        </div>
      </div>
    )
  }
}