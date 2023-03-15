import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import "./input.css"
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.5.0";

// pages
import Home from "pages/Home";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Marketplace from "./pages/Marketplace/marketplace";
import Auctions from "./pages/Marketplace/auctions";
import AuctionItemDetail from "./pages/Marketplace/auctions/itemdetail";
import ItemDetail from "./pages/Marketplace/marketplace/itemdetail";
import Profile from "./pages/Marketplace/profile";
import ListNFT from "./pages/Marketplace/profile/listnft";
import Sold from "./pages/Marketplace/sold";
import Collections from "./pages/Marketplace/collections";
import Collection from "./pages/Marketplace/collections/collection";

import store from "./store";
import { Provider } from 'react-redux';

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route path="/home" render={(props) => <Home {...props} />} />
            <Route path="/login" render={(props) => <Login {...props} />} />
            <Route path="/main" render={(props) => <Main {...props}/>} />
            <Route path="/marketplace/:page_number" render={(props) => <Marketplace {...props}/>} />
            <Route path="/item-details/:id" render={(props) => <ItemDetail {...props}/>} />
            <Route path="/auctions" render={(props) => <Auctions {...props}/>} />
            <Route path="/auction-details/:id" render={(props) => <AuctionItemDetail {...props}/>} />
            <Route path="/collections" render={(props) => <Collections {...props}/>} />
            <Route path="/collection/:collection_name" render={(props) => <Collection {...props}/>} />
            <Route path="/profiles" render={(props) => <Profile {...props}/>} />
            <Route path="/profile/:token_id/:serial_number" render={(props) => <ListNFT {...props}/>} />
            <Route path="/sold" render={(props) => <Sold {...props}/>} />
            <Redirect to="/home" />
            <Redirect from="/" to="/home" />
          </Switch>
        </Provider>
      </BrowserRouter>
    </>
  );
}
export default App;