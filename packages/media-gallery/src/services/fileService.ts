import Queue from './Queue';
import filePool from './filePool';

const MAX_PENDING_SIZE: number = 3;

class FileApi {
    private pendingCount:number = this.pendingList.length;

    constructor(
        private readonly awaiting: Queue<number> = new Queue<number>(),
        private readonly pendingList: File[] = []
    ){}

    public remove(id: number){
        delete filePool[id];
        // TODO: cancel request
    }

    public add(file: File): number {
        const index = filePool.length;
        filePool.push(file);
        this.awaiting.enqueue(index);
        this.sync();
        return index;
    }

    private sync() {
        if(this.pendingCount < MAX_PENDING_SIZE){
            const id = this.awaiting.dequeue();
            const file: File = filePool[id];
            if(file) {
                this.pendingCount++;
                this.pendingList[id] = file;

                var fd = new FormData();
                fd.append('file', file);
                const request = new Request('/api/files',{
                    method: 'POST',
                    body: fd
                });
                fetch(request).then(() => {
                    delete filePool[id];
                    delete this.pendingList[id];
                    this.pendingCount--;
                    this.sync();
                }, () => {
                    this.awaiting.enqueue(id);
                    delete this.pendingList[id];
                    this.pendingCount--;
                    this.sync();
                });
            }
        }
    }


}

export default FileApi;