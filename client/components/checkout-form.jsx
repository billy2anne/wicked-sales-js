import React from 'react';

export default class CheckoutForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      card: '',
      address: ''
    };
    this.setViewCheckout = this.setViewCheckout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setViewCheckout() {
    this.props.view('catalog', {});
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.placeOrder(this.state);
    this.setState({ name: '', card: '', address: '' });
  }

  render() {
    if (this.props.cart === 0) {
      return (
        <div className="cartSummaryContainer col-10 align-content-center">
          <div className="emptyCart">You have 0 items in your cart.</div>
          <div onClick={this.setViewMenu} className="catalogText">
            &lt; Continue Shopping
          </div>
        </div>
      );
    }
    return (
      <div className="row mx-0">
        <div className="col-7 mx-auto d-flex flex-column">
          <h2 className="mb-4">My Cart</h2>
          <form className="d-flex flex-column">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" className="mb-4" value={this.state.name} onChange={this.handleChange} />
            <label htmlFor="creditCard">Credit Card</label>
            <input type="text" id="card" className="mb-4" value={this.state.card} onChange={this.handleChange} />
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea type="textarea" id="address" className="mb-4" value={this.state.address} onChange={this.handleChange} />
            <div className="d-flex justify-content-between">
              <div className="hover text-muted mb-4 pt-0 px-0 btn d-flex justify-content-start" onClick={this.setViewCheckout}>&lt; Back to catalog</div>
            </div>
            <div>
              <button type="button" className="btn btn-primary" id="order" onClick={this.handleSubmit}>Place Order</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
