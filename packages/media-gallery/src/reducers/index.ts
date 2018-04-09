import {ReducersMapObject, Reducer, AnyAction, Action} from 'redux';
import {IFile, RefreshStatus} from "../entities/File";

interface IQFile{
    id: number
    name: string
    lastModified: number
    size: number
}

interface IQFilesState {
    q: IQFile[]
}

const defaultQFileState = {
    q: []
};

const qfilesReducer: Reducer<IQFilesState> = (state: IQFilesState = defaultQFileState, action: AnyAction) => {
    switch (action.type){
        case 'ADD_FILES':
            const newFiles = action.files as IQFile[];
            return {
                q: [...state.q, ...newFiles]
            };
    }
    return state;
};

interface IFilesState {
    refreshStatus: RefreshStatus
    data: IFile[]
}

const defaultFileState = {
    refreshStatus: RefreshStatus.None,
    data: []
};

const filesReducer: Reducer<IFilesState> = (state: IFilesState = defaultFileState, action: AnyAction) => {
    switch (action.type){
        case 'REFRESH':
            return {
            refreshStatus: RefreshStatus.LOADING,
            data: []
        };

        case 'REFRESH_SUCCEEDED': return {
            refreshStatus: RefreshStatus.SUCCEEDED,
            data: action.data
        };

        case 'REFRESH_FAILED': return {
            refreshStatus: RefreshStatus.FAILED,
            data: []
        }
    }
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
    files: IFilesState
    qfiles: IQFilesState
    route: any
    debugger: {
        visible: boolean
    }
}

class Reducers implements ReducersMapObject<IState> {
    files = filesReducer
    route = routeReducer
    debugger = debuggerReducer
    qfiles = qfilesReducer
}

export default new Reducers();
