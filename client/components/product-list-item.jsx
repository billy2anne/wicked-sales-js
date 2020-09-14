import React from 'react';

export default class ProductListItem extends React.Component {

  render() {
    return (
      <div className="card-container col-3 ">
        <div className="image">
          {this.props.image}
        </div>
        <div>
          {this.props.name}
        </div>
          ${this.props.price}
        <div>
          {this.props.shortDescription}
        </div>
      </div>
    );
  }
}
