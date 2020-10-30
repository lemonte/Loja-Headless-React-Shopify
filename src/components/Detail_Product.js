import React, { Component } from 'react';
import Product from './Product';
import Cart from './Cart';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { AiFillFacebook, AiFillTwitterSquare, AiOutlineInstagram } from 'react-icons/ai';
import { flowRight as compose } from 'lodash';
import M from "materialize-css";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import '../app.css'
import {
    createCheckout,
    checkoutLineItemsAdd,
    checkoutLineItemsUpdate,
    checkoutLineItemsRemove,
    checkoutCustomerAssociate,
    addVariantToCart,
    updateLineItemInCart,
    removeLineItemInCart,
    associateCustomerCheckout
} from '../checkout';
import Drawer from './Drawer';
const height_total = (window.innerHeight - 200);
class Detail_Product extends Component {
    constructor() {
        super();
        this.state = {
            isCartOpen: false,
            isCustomerAuthOpen: false,
            isNewCustomer: false,
            products: [],
            isDrawerOpen: false,
            product_open: [],
            checkout: { lineItems: { edges: [] } }
        };

        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleCartClose = this.handleCartClose.bind(this);
        this.handleCartOpen = this.handleCartOpen.bind(this);
        this.openCustomerAuth = this.openCustomerAuth.bind(this);
        this.closeCustomerAuth = this.closeCustomerAuth.bind(this);
        this.addVariantToCart = addVariantToCart.bind(this);
        this.updateLineItemInCart = updateLineItemInCart.bind(this);
        this.removeLineItemInCart = removeLineItemInCart.bind(this);
        this.showAccountVerificationMessage = this.showAccountVerificationMessage.bind(this);
        this.associateCustomerCheckout = associateCustomerCheckout.bind(this);

    }
    componentDidMount() {
        const produto = JSON.parse(localStorage.getItem("product_open"))
        if (produto == null) {
            const { history } = this.props;
            return history.push("/")
        }
        this.setState({ product_open: produto })
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.carousel');
            M.Carousel.init(elems, {
                indicators: true
            });
        });
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            M.Sidenav.init(elems, {});
        });
    }

    componentDidUpdate() {
        var elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems, {
            indicators: true,
            duration: 500
        });
        var elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {});

    }

    static propTypes = {
        data: PropTypes.shape({
            loading: PropTypes.bool,
            error: PropTypes.object,
            shop: PropTypes.object,
        }).isRequired,
        createCheckout: PropTypes.func.isRequired,
        checkoutLineItemsAdd: PropTypes.func.isRequired,
        checkoutLineItemsUpdate: PropTypes.func.isRequired
    }
    componentWillMount() {
        this.props.createCheckout({
            variables: {
                input: {}
            }
        }).then((res) => {
            this.setState({
                checkout: res.data.checkoutCreate.checkout
            });
        });
    }
    handleCartOpen() {
        this.setState({
            isCartOpen: true,
        });
    }
      handleCartClose() {
        this.setState({
            isCartOpen: false,
        });
    }
    handleDrawerOpen() {
        document.body.style.overflow = 'hidden';
        this.setState({
            isDrawerOpen: true
        });
    }
    handleDrawerClose() {
        document.body.style.overflow = null;
        this.setState({
            isDrawerOpen: false
        });
    }
  

    openCustomerAuth(event) {
        if (event.target.getAttribute('data-customer-type') === "new-customer") {
            this.setState({
                isNewCustomer: true,
                isCustomerAuthOpen: true
            });
        } else {
            this.setState({
                isNewCustomer: false,
                isCustomerAuthOpen: true
            });
        }
    }
    showAccountVerificationMessage() {
        this.setState({ accountVerificationMessage: true });
        setTimeout(() => {
            this.setState({
                accountVerificationMessage: false
            })
        }, 5000);
    }

    closeCustomerAuth() {
        this.setState({
            isCustomerAuthOpen: false,
        });
    }


    render() {
        console.log(this.state.product_open)
        return (
            <>
                <nav class="black" style={{ position: "fixed", zIndex: 999, top: 0, right: -10, left: 0, height: 100 }}>
                    <div class="nav-wrapper row" style={{ maxWidth: 1500, margin: 'auto', paddingTop: 20 }}>
                        <div class="col s12 m2" >
                            <a  href="/" style={{zIndex:999}}  class="brand-logo"><i class="material-icons large" >directions_bike</i>Bike Shop</a>
                            <a data-target="slide-out" class="sidenav-trigger "><i class="material-icons">menu</i></a>
                            <a onClick={() => this.handleCartOpen()} class="sidenav-trigger right"><i class="material-icons">local_grocery_store</i></a>
                        </div>
                        <div class="col s12 m8 black" >
                            <nav>
                                <div class="nav-wrapper black"  style={{zIndex:999}}>
                                    <form>
                                        <div class="input-field white" style={{ border: "1px solid white", borderRadius: 10 }}>
                                            <input id="search" type="search" style={{ borderRadius: 10 }} />
                                            <label class="label-icon"><i class="material-icons" style={{ color: "black" }} >search</i></label>
                                            <i class="material-icons" onClick={() => this.handleSearchClose()} style={{ color: "black" }} >close</i>
                                        </div>
                                    </form>
                                </div>
                            </nav>
                        </div>
                        <div class="col s12 m2" >
                            <ul class="right hide-on-med-and-down">
                                <li><a onClick={() => this.handleCartOpen()} ><i class="material-icons">local_grocery_store</i></a></li>
                                <li><a href=""><i class="material-icons">account_circle</i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="nav-wrapper black" >
                        <div class="col s12" style={{maxWidth: 1500,margin: 'auto'}}>
                            <a href="/" class="breadcrumb">Home</a>
                            <a class="breadcrumb">Detalhes</a>
                        </div>
                    </div>

                </nav>
                {Drawer()}
                <div style={{ minHeight: height_total, maxWidth: 1500, margin: "auto", marginTop: 230 }}>
                    <div class="card " style={{ marginTop: 0, marginBottom: 0, marginLeft: -10, paddingBottom: -10 }} >
                        <div class="row">

                            <div class="carousel black-indicator center col s12, m12, l6" >
                                {this.state.product_open.images ? this.state.product_open.images.edges.map((item) => {
                                    return (
                                        <a class="carousel-item"><img src={item.node ? item.node.src : null} height="100%" /></a>
                                    )

                                }) : null}
                            </div>

                            <div class="card-content center col s12 m12 l6">
                                <span class="card-title center-align">{this.state.product_open.title ? this.state.product_open.title : "Campo Vazio"}</span>
                            </div>
                            <div class="col s12 m12 l6 center" style={{ height: 80 }} >
                                <span style={{ fontWeight: "bold", marginLeft: 20, textAlign: "center" }}
                                    class="card-title">{this.state.product_open.variants ? "R$" + this.state.product_open.variants.edges[0].node.price : "Campo Vazio"}</span>
                            </div>

                            <div class="card-content col s12 m12 l6 center">
                                <a href="/produto/detalhes" class="btn"
                                >Comprar o produto
                        <i class="material-icons right">send</i>
                                </a>     </div>

                        </div>
                    </div>
                </div>

                <Drawer
                    isDrawerOpen={this.state.isDrawerOpen}
                    handleDrawerClose={this.handleDrawerClose}
                />
                <Cart
                    removeLineItemInCart={this.removeLineItemInCart}
                    updateLineItemInCart={this.updateLineItemInCart}
                    checkout={this.state.checkout}
                    isCartOpen={this.state.isCartOpen}
                    handleCartClose={this.handleCartClose}
                />
                <footer class="page-footer black">
                    <div class="container">
                        <div class="row">
                            <div class="col l6 s12">
                                <h5 class="white-text">Footer Content</h5>
                                <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                            </div>
                            <div class="col l4 offset-l2 s12">
                                <h5 class="white-text">Links</h5>
                                <ul>
                                    <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                                    <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                                    <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                                    <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="footer-copyright">
                        <div class="container">
                            © 2014 Copyright Text
            <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
                        </div>
                    </div>
                </footer>

            </>
        )
    }
}


const query = gql`
  query query {
    shop {
      name
      description
      products(first:20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

const AppWithDataAndMutation = compose(
    graphql(query),
    graphql(createCheckout, { name: "createCheckout" }),
    graphql(checkoutLineItemsAdd, { name: "checkoutLineItemsAdd" }),
    graphql(checkoutLineItemsUpdate, { name: "checkoutLineItemsUpdate" }),
    graphql(checkoutLineItemsRemove, { name: "checkoutLineItemsRemove" }),
    graphql(checkoutCustomerAssociate, { name: "checkoutCustomerAssociate" })
)(withRouter(Detail_Product));

export default withRouter(AppWithDataAndMutation);
