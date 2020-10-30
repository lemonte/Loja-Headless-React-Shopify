import React, { useState } from 'react';


function Product(props){
  
  const descricao = "I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively."

  return(
    <>
    <div class="col s12 m6 l3" style={{cursor:"pointer"}} >
      <div class="card hoverable">
        <div class="card-image">
          <img src={props.product.images.edges[0].node.src} height="400px"/>
          <a class="btn-floating halfway-fab waves-effect waves-light red hoverable"><i class="large material-icons">add_shopping_cart</i></a>
        </div>
        <div class="card-content">
        <span class="card-title ">{props.product.title ? props.product.title : "Campo Vazio"}</span>
          <p>{descricao.substr(1, 50) + "..."}</p>
          <span style={{fontWeight:"bold", marginTop:20}} class="card-title ">{props.product.variants.edges[0].node.price ? "R$" + props.product.variants.edges[0].node.price : "Campo Vazio"}</span>
        </div>
      </div>
    </div>
          
    </>
  )
  }

export default Product;
