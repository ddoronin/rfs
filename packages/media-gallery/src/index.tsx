import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../styles/main.scss';
import { hot } from 'react-hot-loader';

const elementId = 'app';
let appEl = document.getElementById(elementId);
if(!appEl) {
    appEl = document.createElement('div');
    appEl.id = elementId;
    document.body.appendChild(appEl);
    appEl = document.getElementById(elementId);
}

ReactDOM.render(<App/>, appEl);

// Enable HMR
export default hot(module)(App); // tslint-disable;
