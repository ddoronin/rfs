import React from 'react';
import FilePicker from './FilePicker';
import FileQueue from './FileQueue';

interface IState {
    fileQueue: File[]
}

class MediaGallery extends React.Component<{}, IState> {
    constructor(props){
        super(props);
        this.state = {
            fileQueue: []
        };
    }

    onAddToQueue = () => {
        
    }

    componentDidMount(){
    }

    handleFiles = (fileList: FileList) => {
        let newFiles = [];
        for(let i = 0, len = fileList.length; i < len; i++){
            newFiles.push(fileList.item(i));
        }
        this.setState({
            fileQueue: [...this.state.fileQueue, ...newFiles]
        });
    }

    syncFile(file: File){
        let fr = new FileReader();
        fr.readAsArrayBuffer(file);
        
    }

    render(){
        return (
            <article>
                <header>
                    <h1>
                        Remote File Manager
                    </h1>
                </header>
                <section>
                    <FilePicker handleFiles={this.handleFiles}>
                        <div>Drag&Drop Files here or click the Upload button</div>
                        <FileQueue files={this.state.fileQueue}/>
                    </FilePicker>
                </section>
            </article>
        );
    }
}

export default MediaGallery;