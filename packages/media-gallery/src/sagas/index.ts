import { put, takeEvery } from 'redux-saga/effects'
import FileApi from "../services/fileService";

const fapi = new FileApi();

export default function*(){
    yield takeEvery('REFRESH', function*(){
        try {
            const files = yield fetch('/api/files').then(res => res.json());
            yield put({type: 'REFRESH_SUCCEEDED', data: files});
        } catch (e){
            yield put({type: 'REFRESH_FAILED'});
        }
    });

    yield takeEvery<{type: string, files: File[]}>('NEW_FILES', function*({type, files}){
        console.log('files', files);

        const newFiles = files.map((file) => ({
            id: fapi.add(file),
            name: file.name,
            size: file.size,
            lastModified: file.lastModified
        }));
        console.log(newFiles);
        yield put({type: 'ADD_FILES', files: newFiles});
    });
}
