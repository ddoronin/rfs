import React from 'react';
import {IFile, RefreshStatus} from "../entities/File";

export interface IFileManagerProps{
    files: IFile[]
    beforeRender: () => void
    refresh: () => void
    refreshStatus: RefreshStatus
}

class FileManager extends React.Component<IFileManagerProps, {}>{
    componentWillMount(){
        this.props.beforeRender();
    }
    render() {
        const {
            files,
            refreshStatus,
            refresh
        } = this.props;

        switch (refreshStatus){
            case RefreshStatus.LOADING: return (
                <div className="file-manager loading">
                    Loading...
                </div>
            );

            case RefreshStatus.None: return (
                <div className="file-manager">
                    <button onClick={refresh}>Refresh</button>
                </div>
            );
            case RefreshStatus.FAILED: return (
                <div className="file-manager failed">
                    <button onClick={refresh}>Refresh</button>
                </div>
            );
            case RefreshStatus.SUCCEEDED:{
                if(files.length === 0) {
                    return (
                        <div className="file-manager no-files">
                            No files so far.
                        </div>
                    );
                }

                return (
                    <div className="file-manager">
                        <ul className="file-list">
                            {files.map((file, index) => (
                                <li key={index}>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        }
    }
}

export default FileManager;