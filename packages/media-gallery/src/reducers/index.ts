import {ReducersMapObject, Reducer, AnyAction, Action} from 'redux';

type FileItem = string;

const filesReducer: Reducer<FileItem[]> = (state: FileItem[] = [], action: AnyAction) => {
    return state;
};

const routeReducer: Reducer<any> = (state: any = {}, action: Action<any> & {params: any}) => {
    switch (action.type) {
        case 'ROUTE':
            return action.params;
        default:
            return state;
    }
};

const debuggerReducer: Reducer<any> = (state: any = {visible: true}, action: Action<any> & {params: any}) => {
    switch (action.type) {
        case 'TOGGLE_DEBUGGER':
            return {visible: !state.visible};
        default:
            return state;
    }
};

export interface IState {
    files: FileItem[],
    route: any,
    debugger: {
        visible: boolean
    }
}

class Reducers implements ReducersMapObject<IState> {
    files = filesReducer
    route = routeReducer
    debugger = debuggerReducer
}

export default new Reducers();
