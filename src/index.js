import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  
    <React.StrictMode>
      <App />
    </React.StrictMode>,
 
  document.getElementById("root")
);