import React from 'react';

export default class ProductListItem extends React.Component {

  render() {
    return (
      <div className="card-container col-3 " onClick={this.props.setViewDetails} id ={this.props.productId}>
        <div className="image">
          <img src={this.props.product.image}/>
        </div>
        <div className="name">
          {this.props.name}
        </div>
        <div className="price">
          ${this.props.price}
        </div>
        <div className="description">
          {this.props.shortDescription}
        </div>
      </div>
    );
  }
}
