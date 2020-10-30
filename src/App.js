

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../src/components/Home"
import Detail_Product from "./components/Detail_Product";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/produto/detalhes" component={Detail_Product} exact />
            </Switch>
        </BrowserRouter>
    );
}