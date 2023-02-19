import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.5.0";

// pages
import Home from "pages/Home";
import Login from "./pages/Login";
import Main from "./pages/Main";
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
            <Redirect to="/home" />
            <Redirect from="/" to="/home" />
          </Switch>
        </Provider>
      </BrowserRouter>
    </>
  );
}
export default App;