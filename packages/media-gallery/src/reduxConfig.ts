import { Action, createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers, { IState } from './reducers/index';
import sagas from './sagas/index';

import logger from './middlewares/logger';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// mount it on the Store
const store = createStore<IState, Action<any>, {}, {}>(
    combineReducers(reducers),
    applyMiddleware(logger, sagaMiddleware)
);

// then run the saga
sagaMiddleware.run(sagas);
