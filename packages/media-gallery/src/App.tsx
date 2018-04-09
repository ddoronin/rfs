import React from 'react';
import PropTypes from 'prop-types';
import { initStore } from './reduxConfig';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Action, Dispatch, Store } from "redux";
import { IState } from "./reducers";
import FileManager from "./containers/FileManager";
import FilePicker from "./components/FilePicker";

const store = initStore();

interface IStoreState<S> {
    state: S
    dispatch: (action: Action<any> & any) => Action<any> & any;
    actions: any[]
}

class StoreProvider extends React.Component<{}, IStoreState<IState>>  {
    private actions: Action<any>[] = [];

    constructor(props, context) {
        super(props, context);

        this.state = {
            state: store.getState(),
            actions: [],
            dispatch: (action: Action<any>) => {
                this.actions = [action, ...this.actions];
                this.setState({actions: this.actions});
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

        return (
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
                    <Route exact path="/" render={() =>
                        <FilePicker
                            handleFiles={(files) =>
                                dispatch({type: 'NEW_FILES', files})
                            }>
                        <FileManager
                            files={state.files.data}
                            beforeRender={() => dispatch({type: 'REFRESH'})}
                            refresh={() => dispatch({type: 'REFRESH'})}
                            refreshStatus={state.files.refreshStatus} />
                        </FilePicker>
                    } />
                    <Route path="/queue" component={() => <>Queue</>} />
                    {state.debugger.visible && <footer className="debugger">
                        <ActionDebugger actions={actions}/>
                        <StateDebugger state={state}/>
                    </footer>}
                </article>
            </RouterDispatcher>
        </Router>);
    }
}

interface IDispatcher {
    dispatch: (action: Action<any>) => Action<any>
}

class RouterDispatcher extends React.Component<IDispatcher, {}> {
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
        this.props.dispatch({type: 'ROUTE', params: location} as any);
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

  
export default () => <StoreProvider/>;
