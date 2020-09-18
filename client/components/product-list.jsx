import React from 'react';
import ProductListItem from './product-list-item';

export default class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.setView = this.setView.bind(this);
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

  render() {

    const products = this.state.products.map(product =>
      <ProductListItem
        setView = {this.setView}
        product={product}
        key={product.productId}
        name={product.name}
        price={product.price}
        shortDescription={product.shortDescription}
        productId={product.productId}
      />);

    return (
      <div className="row justify-content-center">
        {products}
      </div>
    );
  }

}
