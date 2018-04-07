import { ReducersMapObject, Reducer, AnyAction } from 'redux';

type FileItem = string;

const filesReducer: Reducer<FileItem[]> = (state: FileItem[] = [], action: AnyAction) => {
    return state;
};

export interface IState {
    files: FileItem[]
}

class Reducers implements ReducersMapObject<IState> {
    public files = filesReducer;
}

export default new Reducers();
