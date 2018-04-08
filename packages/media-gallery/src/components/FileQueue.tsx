import React from 'react';
import FilePicker from './FilePicker';

interface IProps {
    files: File[]
}

class FileQueue extends React.Component<IProps> {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <ul>
                {this.props.files.map((file: File, index: number) => {
                    return (
                        <li key={index}>
                            <h4>{file.name} - {file.size}</h4>
                            <small>{file.lastModified} >> {file.type}</small>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default FileQueue;