import React from 'react';
import PropTypes from 'prop-types';
import { initStore } from './reduxConfig';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Action, Dispatch, Store } from "redux";
import { IState } from "./reducers";

const store = initStore();

interface IStoreRC<S> {
    render: (state: S, dispatch: Dispatch<Action<any>>, actions: any[]) => React.ReactNode
}

interface IStoreState<S> {
    state: S
    dispatch: Dispatch<Action<any>>
    actions: any[]
}

class StoreProvider extends React.Component<IStoreRC<IState>, IStoreState<IState>>  {
    constructor(props, context) {
        super(props, context);

        this.state = {
            state: store.getState(),
            actions: [],
            dispatch: (action: Action<any>):any => {
                this.setState({actions: [action, ...this.state.actions]});
                return store.dispatch(action);
            }
        }
    }

    componentWillMount(){
        store.subscribe(() => {
            console.log('state has been updated ', store.getState());
            this.setState({state: store.getState()});
        });
    }

    render() {
        const {
            state,
            dispatch,
            actions
        } = this.state;
        return <>{this.props.render(state, dispatch, actions)}</>;
    }
}

interface IRouteHandler {
    routeParams: any
}

interface IDispatcher<T> {
    dispatch: Dispatch<Action<T>>
}

class RouterDispatcher extends React.Component<IDispatcher<any>, {}> {
    static contextTypes = {
        router: PropTypes.object
    };

    private unlisten: () => void;

    componentDidMount() {
        this.handleLocationChange(this.context.router.history.location);
        this.unlisten =
            this.context.router.history.listen((location) => this.handleLocationChange(location));
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleLocationChange(location) {
        this.props.dispatch({type: 'ROUTE', params: location});
    }

    render() {
        return this.props.children;
    }
}

const StateDebugger = ({state}) => (
    <pre className="state">
        {JSON.stringify(state, null, 2)}
    </pre>
);

const ActionDebugger = ({actions}) => (
    <div className="actions">
        {actions.map((action, index) => (
            <div key={'action-' + index}>
                <pre >{
                    JSON.stringify(action, null, 2)}
                </pre>
            </div>
        ))}
    </div>
);

const StateRouter = (state: IState, dispatch: Dispatch<Action<any>>, actions: any[]) => (
    <Router>
        <RouterDispatcher dispatch={dispatch}>
            <article className="page">
                <header>
                    <Link to="/"> Home/</Link>
                    <Link to="/queue">Queue/</Link>
                    <Link to="/succeeded">Succeeded/</Link>
                    <Link to="/failed">Failed/</Link>
                </header>
                <div onClick={() => dispatch({type: 'TOGGLE_DEBUGGER'})}>
                    Click to {!state.debugger.visible ? 'show': 'hide'} debugger.
                </div>
                <Route exact path="/" component={() => <>Media Gallery</>} />
                <Route path="/queue" component={() => <>Queue</>} />
                {state.debugger.visible && <footer className="debugger">
                    <ActionDebugger actions={actions}/>
                    <StateDebugger state={state}/>
                </footer>}
            </article>
        </RouterDispatcher>
    </Router>
);
  
export default () => <StoreProvider render={StateRouter}/>;
