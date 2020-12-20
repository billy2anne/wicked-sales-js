import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    this.getCartItems();
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params: {
          productId: params
        }
      }
    });
  }

  addToCart(product) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          cart: this.state.cart.concat(data)
        });
      });
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        this.setState({
          cart: data
        });
      });
  }

  placeOrder(object) {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: object.name,
        creditCard: object.card,
        shippingAddress: object.address
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ cart: [] });
          this.setView('catalog', {});
        })
        .catch(err => console.error(err))
    });
  }

  render() {
    const viewType = this.state.view.name;
    if (viewType === 'catalog') {
      return (
        <div>
          <Header cartItemCount={this.state.cart.length} view={this.setView}/>
          <ProductList setView ={this.setView}/>
        </div>
      );
    } else if (viewType === 'details') {
      return (
        <div>
          <Header cartItemCount={this.state.cart.length} view={this.setView} />
          <ProductDetails
            product={this.props.product}
            view={this.setView}
            viewParams={this.state.view.params}
            addToCart={this.addToCart}
          />
        </div>
      );
    } else if (viewType === 'cart') {
      return (
        <div>
          <Header cartItemCount={this.state.cart.length} view={this.setView} />
          <CartSummary cart={this.state.cart} view={this.setView} />
        </div>
      );
    } else if (viewType === 'checkout') {
      return (
        <div>
          <Header cartItemCount={this.state.cart.length} view={this.setView} />
          <CheckoutForm placeOrder={this.placeOrder} />
        </div>
      );
    }
  }
}
