import React from 'react';

export default class ProductDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    fetch(`/api/products/${this.props.viewParams.productId.productId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ product: data });
      });
  }

  addToCart() {
    this.props.addToCart(this.state.product);
  }

  setView(e) {
    this.props.view('catalog', {});
  }

  render() {
    if (!this.state.product) {
      return null;
    } else {
      return (
        <>
          <div onClick={this.setView}>
            &lt;Back to catalog
          </div>
          <div className="prodDetailsContainer col-12">
            <img src={this.state.product.image} className="detailsImage" />
            <div className="detailsContentcontainer">
              <h1 className="nameProductDetails">{this.state.product.name}</h1>
              <div className="price">${(this.state.product.price / 100).toFixed(2)}</div>
              <div className="description">{this.state.product.shortDescription}</div>
            </div>
          </div>
          <div className="longDescription">{this.state.product.longDescription}</div>
          <button onClick={this.addToCart}>Add to Cart</button>
        </>
      );
    }
  }

}
