export interface IQueue<T> extends Iterable<T>{
    enqueue(item: T): void;
    dequeue():T;
    isEmpty(): boolean;
    size(): number;
}

export class Queue<T> implements IQueue<T>{
    private readonly items: T[];

    constructor(items: T[] = []) {
        this.items = items;
    }

    // add an item
    enqueue(item: T) {
       this.items.push(item);
    }

    // remove the least recently added item
    dequeue():T {
        return this.items.shift();
    }
    
    // is the queue empty?
    isEmpty(): boolean {
        return this.size() === 0;
    }

    // number of items in the queue
    size(): number {
        return this.items.length;
    }

    [Symbol.iterator] = function*(){
        for(let item of this.items){
            yield item;
        }
    }
}

export default Queue;