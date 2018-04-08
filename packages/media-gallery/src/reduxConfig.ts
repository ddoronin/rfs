import { Store, Action, createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers, { IState } from './reducers/index';
import logger from './middlewares/logger';
import sagas from './sagas/index';

export function initStore(): Store<IState, Action<any>>{
    // create the saga middleware
    const sagaMiddleware = createSagaMiddleware();

    // mount it on the Store
    const store = createStore<IState, Action<any>, {}, {}>(
        combineReducers(reducers),
        applyMiddleware(logger)
    );

    // then run the saga
    //sagaMiddleware.run(sagas);

    return store;
}
