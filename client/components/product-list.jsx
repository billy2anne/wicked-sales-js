import React from 'react';
import ProductListItem from './product-list-item';

export default class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.setViewDetails = this.setViewDetails.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        return this.setState({ products: data });
      });
  }

  setViewDetails(e) {
    const productId = e.currentTarget.getAttribute('id');
    this.props.setView('details', { productId });
  }

  render() {
    const products = this.state.products.map(product =>
      <ProductListItem
        product={product}
        key={product.productId}
        name={product.name}
        price={product.price}
        shortDescription={product.shortDescription}
        productId={product.productId}
        setViewDetails={this.setViewDetails}
      />);

    return (
      <div className="productListContainer">
        <div className="row justify-content-center">
          {products}
        </div>
      </div>
    );
  }

}
