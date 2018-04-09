import React, {ChangeEvent} from 'react';
import cn from 'classnames';

interface IState{
    draggingOverTarget: boolean
}

export interface IProps{
    children?: React.ReactNode,
    handleFiles?: (files: File[]) => void
}

class FilePicker extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {draggingOverTarget: false};
    }

    onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({draggingOverTarget: false});
        const files = event.dataTransfer.files;
        if(files){
            let fs = [];
            for(let i = 0; i < files.length; i++){
                fs[i] = files.item(i);
            }
            this.props.handleFiles(fs);
        }
    }

    onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({draggingOverTarget: false});
    }

    onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }

    onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({draggingOverTarget: true});
    }

    render(){
        return (
            <div className={cn('react-file-reader', {
                'is-dragover': this.state.draggingOverTarget
            })}
                 onDragEnter={this.onDragEnter}
                 onDragOver={this.onDragOver}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDrop}>
                {this.props.children && this.props.children}
            </div>
        );
    }
}

export default FilePicker;