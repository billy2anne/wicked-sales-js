import React from 'react';

export default class ProductDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
  }

  componentDidMount() {
    fetch(`/api/products/${this.props.productId}`)
      .then(response => response.json())
      .then(data => {
        return this.setState({ product: data });
      });

  }

  render() {
    return null;
  }

}
