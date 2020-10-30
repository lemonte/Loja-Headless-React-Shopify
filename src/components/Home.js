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
class Home extends Component {
    constructor() {
        super();
        this.state = {
            isCustomerAuthOpen: false,
            isNewCustomer: false,
            products: [],
            isCartOpen: false,
            product_open: null,
            checkout: { lineItems: { edges: [] } }
        };
        this.handleCartClose = this.handleCartClose.bind(this);
        this.handleCartOpen = this.handleCartOpen.bind(this);
        this.handleCloseProduct = this.handleCloseProduct.bind(this);
        this.handleOpenProduct = this.handleOpenProduct.bind(this);
        this.openCustomerAuth = this.openCustomerAuth.bind(this);
        this.closeCustomerAuth = this.closeCustomerAuth.bind(this);
        this.addVariantToCart = addVariantToCart.bind(this);
        this.updateLineItemInCart = updateLineItemInCart.bind(this);
        this.removeLineItemInCart = removeLineItemInCart.bind(this);
        this.showAccountVerificationMessage = this.showAccountVerificationMessage.bind(this);
        this.associateCustomerCheckout = associateCustomerCheckout.bind(this);
    }

    componentDidMount() {

        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            M.Sidenav.init(elems, {});
        });
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.carousel');
            M.Carousel.init(elems, {
                indicators: false
            });
        });
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.materialboxed');
            M.Materialbox.init(elems, {});
        });
        const options = {
            onOpenStart: () => {
            },
            onOpenEnd: () => {
            },
            onCloseStart: () => {
                this.handleCloseProduct()
            },
            onCloseEnd: () => {
                this.handleCloseProduct()
            },
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: false,
            startingTop: "4%",
            endingTop: "10%"
        };

        M.Modal.init(this.Modal, options);
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.modal');
            M.Modal.init(elems, {});
        });
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.fixed-action-btn');
            M.FloatingActionButton.init(elems, {
                direction: 'left',
                hoverEnabled: false
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
    componentDidUpdate() {
        var elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {});
        var elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems, {
            indicators: true,
            duration: 500
        });
        var elems = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(elems, {});
        var elems = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
        });
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

    handleOpenProduct(product) {
        this.setState({
            product_open: product,
        });
    }
    handleCloseProduct() {
        this.setState({
            product_open: [],
        });
    }
    open_modal() {
        const elem = document.getElementById('modal');
        const instance = M.Modal.init(elem, { dismissible: false });
        return instance.open();
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
    Ir_Produto() {
        const { history } = this.props;
        history.push("")
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

    modal_edit_product() {
        const { product_open } = this.state
        const descricao = "I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively."
        if (this.state.product_open == null) return <div id="modal" class="modal"></div>;
        console.log(product_open.node)
        localStorage.setItem("product_open", JSON.stringify(product_open.node));
        return (
            <div id="modal" class="modal" style={{ padding: 0 }}>
                <div class="card" style={{ marginTop: 0, marginBottom: 0, marginLeft: -10, paddingBottom: -10 }} >
                    <a onClick={() => {
                        document.body.style.overflow = null;
                        const elem = document.getElementById('modal');
                        const instance = M.Modal.init(elem, { dismissible: false });
                        return instance.close();
                    }} style={{ height: 40, zIndex: 999, position: "absolute", right: 0, top: 0, cursor: "pointer" }} ><i class="material-icons" style={{ color: "black", marginTop: 5, marginRight: 5 }}>close</i></a>
                    <div class="row">
                        <div class="carousel col s12, m12, l6">
                            {product_open.node.images ? product_open.node.images.edges.map((item) => {
                                return <a class="carousel-item" href="/produto/detalhes"><img src={item.node ? item.node.src : null} style={{ maxHeight: "100%" }} /></a>
                            }) : null}

                        </div>

                        <div class="card-content col s12, m12, l6">
                            <span class="card-title ">{product_open.node.title ? product_open.node.title : "Campo Vazio"}</span>
                            <p>{descricao.substr(1, 50) + "..."}</p>
                        </div>   <span style={{ fontWeight: "bold", marginLeft: 20 }} class="card-title ">{product_open.node.variants ? "R$" + product_open.node.variants.edges[0].node.price : "Campo Vazio"}</span>

                        <div class="card-content col s12, m12, l6">
                            <a href="/produto/detalhes" class="btn waves-effect waves-light"
                            // onClick={() => {  return this.Ir_Produto() }}
                            >Ir para o produto
    <i class="material-icons right">send</i>
                            </a>     </div>

                    </div>
                </div>

            </div>
        )
    }



    render() {
        if (this.props.data.loading) {
            return <div class="div-loader">
                <div class="c-loader"></div>
            </div>
        }
        if (this.props.data.error) {
            return <p>{this.props.data.error.message}</p>;
        }

        return (
            <><div  >
                <nav class="black" style={{ position: "fixed", zIndex: 999, top: 0, right: -10, left: 0, height: 100 }}>
                    <div class="nav-wrapper row" style={{ maxWidth: 1500, margin: 'auto', paddingTop: 20 }}>
                        <div class="col s12 m2" >
                            <a href="/" class="brand-logo" style={{ zIndex: 999 }} ><i class="material-icons large">directions_bike</i>Bike Shop</a>
                            <a data-target="slide-out" class="sidenav-trigger "><i class="material-icons">menu</i></a>
                            <a onClick={() => this.handleCartOpen()} class="sidenav-trigger right"><i class="material-icons">local_grocery_store</i></a>
                        </div>
                        <div class="col s12 m8 black">
                            <nav>
                                <div class="nav-wrapper black"  >
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
                    <div class="nav-content black" style={{ paddingBottom: 30 }}>
                        <ul class="tabs tabs-transparent" style={{ maxWidth: 1500, margin: 'auto' }}>
                            <li class="tab navegacao">
                                <a >Todos</a>
                                <ul>
                                    <div class="row" >
                                        <div class="col s3" style={{ fontSize: 16 }}>
                                            <div style={{ fontSize: 16, fontWeight:"bold" }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                        </div>
                                        <div class="col s3" style={{ fontSize: 16 }}>
                                            <div style={{ fontSize: 16, fontWeight:"bold" }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                        </div>
                                        <div class="col s3" style={{ fontSize: 16 }}>
                                            <div style={{ fontSize: 16, fontWeight:"bold" }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                        </div>
                                        <div class="col s3" style={{ fontSize: 16 }}>
                                            <div style={{ fontSize: 16, fontWeight:"bold" }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                            <div style={{ fontSize: 16 }}>Testeee</div>
                                        </div>
                                    </div>
                                </ul>
                            </li>
                            <li class="tab navegacao">
                                <a >Assessórios</a>
                                <ul>
                                    <li><a href="">Capacetes</a></li>
                                    <li><a href="">Roupas</a></li>
                                    <li><a href="">Sacola</a></li>
                                </ul>
                            </li>
                            <li class="tab navegacao">
                                <a >Bicicletas </a>
                                <ul>
                                    <li><a href="">Link 1</a></li>
                                    <li><a href="">Link 2</a></li>
                                    <li><a href="">Link 3</a></li>
                                </ul>
                            </li>
                            <li class="tab navegacao">
                                <a >Roupas</a>
                                <ul>
                                    <li><a href="">Link 1</a></li>
                                    <li><a href="">Link 2</a></li>
                                    <li><a href="">Link 3</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                {Drawer()}
                <Cart
                    removeLineItemInCart={this.removeLineItemInCart}
                    updateLineItemInCart={this.updateLineItemInCart}
                    checkout={this.state.checkout}
                    isCartOpen={this.state.isCartOpen}
                    handleCartClose={this.handleCartClose}
                />
                <div style={{ maxWidth: 1500, margin: 'auto' }} >

                    <ul class="sidenav" id="mobile-demo">
                        <li><a href="sass.html">Entar</a></li>
                        <li><a href="badges.html">Favoritos</a></li>
                        <li><a onClick={() => this.handleCartOpen()}>Carrinho</a></li>
                    </ul>
                    <div style={{ minHeight: height_total }}>
                        <div style={{ marginTop: 200 }} >
                            <div class="carousel carousel-slider" style={{ marginBottom: 80 }} data-indicators="true">
                                <div class="carousel-fixed-item">
                                    <div class="container">
                                        <h1 class="white-text">Minha Loja Ofertas</h1>
                                        <a class="btn waves-effect white grey-text darken-text-2" href="https://codepen.io/collection/nbBqgY/" target="_blank">Ofertas</a>
                                    </div>
                                </div>
                                <div class="carousel-item black lighten-2 white-text" href="#one!">
                                    <div class="container">
                                        <h2>Primeiro Slide</h2>
                                        <p class="white-text">Promoção de ferramentas.</p>
                                    </div>
                                </div>
                                <div class="carousel-item amber darken-2 white-text" href="#two!">
                                    <div class="container">
                                        <h2>Segundo Slide</h2>
                                        <p class="white-text">Promoção de bicicletas .</p>
                                    </div>
                                </div>
                                <div class="carousel-item green white-text" href="#three!">
                                    <div class="container">
                                        <h2>Terçeiro Slide</h2>
                                        <p class="white-text">Promoção de roupas.</p>
                                    </div>
                                </div>
                                <div class="carousel-item blue white-text" href="#four!">
                                    <div class="container">
                                        <h2>Quinto Slide</h2>
                                        <p class="white-text">Mais usados</p>
                                    </div>
                                </div>
                            </div>
                            <div class="row" >

                                {this.props.data.shop.products.edges.map(product => {
                                    //  console.log(product)
                                    return <div onClick={() => {
                                        this.handleOpenProduct(product)
                                        return this.open_modal(product)
                                    }} >
                                        <Product addVariantToCart={this.addVariantToCart} checkout={this.state.checkout} key={product.node.id.toString()} product={product.node} />
                                    </div>
                                }
                                )}
                            </div>
                        </div>
                    </div>

                    <div class="elemento-pai">
                        <div class="elemento-filho">
                            {this.modal_edit_product()}
                        </div>
                    </div>
                </div>
            </div>
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
                <div class="fixed-action-btn">
                    <a class="btn-floating btn-large red">
                        <i class="large material-icons">share</i>
                    </a>
                    <ul>
                        <li><a class="btn-floating yellow darken-1"><i class="material-icons">local_phone</i></a></li>
                        <li><a class="btn-floating green"><i class="material-icons">email</i></a></li>
                        <li><a class="btn-floating blue"> <AiFillTwitterSquare size={24} style={{ margin: 0, marginTop: 8, marginRight: 8 }} /> </a></li>
                        <li><a class="btn-floating white"><AiOutlineInstagram color={"red"} size={24} style={{ margin: 0, marginTop: 8, marginRight: 8 }} /> </a></li>
                        <li><a class="btn-floating blue"><AiFillFacebook size={24} style={{ margin: 0, marginTop: 8, marginRight: 8 }} /></a></li>
                    </ul>
                </div>
            </>
        )



        /*
           <nav class="nav-extended black" style={{ padding: 20, position: "fixed", top: 0, left: 0, right: 0, zIndex: 900 }}>
                            <div style={{ maxWidth: 1500, margin: 'auto' }} >
                                <div class="nav-wrapper" >
                                    <a href="" class="brand-logo" >Minha loja</a>
        
                                    <a onClick={() => this.handleCartOpen()}><i class="material-icons right">local_grocery_store</i></a>
                                    <a data-target="slide-out" class="sidenav-trigger "><i class="material-icons">menu</i></a>
                                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                                        <li><a href="sass.html"><i class="material-icons">account_circle</i></a></li>
                                    </ul>
                                </div>
                                <div class="nav-content">
                                    <ul class="tabs tabs-transparent">
                                        <li class="tab"><a class="active" href="#test2">Todos</a></li>
                                        <li class="tab"><a href="#test1">Ferramentas</a></li>
                                        <li class="tab"><a href="#test2">Camisas</a></li>
                                        <li class="tab disabled"><a href="#test3">Bicicletas</a></li>
                                        <li class="tab"><a href="#test4">Bonés</a></li>
                                    </ul>
                                </div>
        
                            </div>
                           
                        </nav>
        
        */


        /*
            return (
              <div className="App">
                <div className="Flash__message-wrapper">
                  <p className={`Flash__message ${this.state.accountVerificationMessage ? 'Flash__message--open' : ''}`}>We have sent you an email, please click the link included to verify your email address</p>
                </div>
                <CustomerAuthWithMutation
                  closeCustomerAuth={this.closeCustomerAuth}
                  isCustomerAuthOpen={this.state.isCustomerAuthOpen}
                  newCustomer={this.state.isNewCustomer}
                  associateCustomerCheckout={this.associateCustomerCheckout}
                  showAccountVerificationMessage={this.showAccountVerificationMessage}
                />
                <header className="App__header">
                  <ul className="App__nav">
                    <li className="button App__customer-actions" onClick={this.openCustomerAuth} data-customer-type="new-customer">Create an Account</li>
                    <li className="login App__customer-actions" onClick={this.openCustomerAuth}>Log in</li>
                  </ul>
                  {!this.state.isCartOpen &&
                    <div className="App__view-cart-wrapper">
                      <button className="App__view-cart" onClick={()=> this.setState({isCartOpen: true})}>Cart</button>
                    </div>
                  }
                  <div className="App__title">
                    <h1>{this.props.data.shop.name}: React Example</h1>
                    <h2>{this.props.data.shop.description}</h2>
                  </div>
                </header>
                <div className="Product-wrapper">
                  { this.props.data.shop.products.edges.map(product =>
                  
                  {
                    console.log(product)
                     return <Product addVariantToCart={this.addVariantToCart} checkout={this.state.checkout} key={product.node.id.toString()} product={product.node} />}
                  )}
                </div>
                <Cart
                  removeLineItemInCart={this.removeLineItemInCart}
                  updateLineItemInCart={this.updateLineItemInCart}
                  checkout={this.state.checkout}
                  isCartOpen={this.state.isCartOpen}
                  handleCartClose={this.handleCartClose}
                  customerAccessToken={this.state.customerAccessToken}
                />
              </div>
            );
          */
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
)(withRouter(Home));

export default withRouter(AppWithDataAndMutation);

