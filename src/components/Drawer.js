import React from 'react';
import logo from "../assets/bike-1@2x.png"
function Drawer(props) {

  return (
    <>
      <ul id="slide-out" class="sidenav">
        <li>
          <div class="user-view">
            <div class="background">
              <img src={logo} />
            </div>
            <a href="#user"><i class="material-icons large" style={{ color: "white" }} >account_circle</i></a>
            <a href="#name"><span class="white-text name">Geanderson</span></a>
            <a href="#email"><span class="white-text email">geandersonlemonte.gl@gmail.com</span></a>
          </div></li>
        <li><a href="#!"><i class="material-icons">fitness_center</i>Equipamentos</a></li>
        <li><a href="#!"><i class="material-icons">directions_bike</i>Bicicletas</a></li>
        <li><a href="#!"><i class="material-icons">wc</i>Roupas</a></li>
        <li><div class="divider"></div></li>
        <li><a class="subheader">Informações</a></li>
        <li><a href="#!"><i class="material-icons">info</i>Sobre</a></li>
        <li><a href="#!"><i class="material-icons">help</i>Ajuda</a></li>
      </ul>

    </>
  )
}

export default Drawer;
