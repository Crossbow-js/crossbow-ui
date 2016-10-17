import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import "rxjs/add/observable/merge";
import "rxjs/add/observable/fromEvent";
import {SequenceItem} from "crossbow/dist/task.sequence.factories";
import {Task} from "crossbow/dist/task.resolve";
const io = require("socket.io-client/socket.io.js");

export interface IncomingTask {
    name: string
    runner: {
        tasks: Task[]
        sequence: SequenceItem[]
    }
}

export interface SocketConnection {
    type: 'idle' | 'connect' | 'reconnect_attempt' | 'reconnect' | 'disconnect',
    status: boolean
}

@Injectable()
export class TasksService {

    task$: Subject<IncomingTask[]>;
    socket: SocketIOClient.Socket;
    connection$ = new BehaviorSubject<SocketConnection>({type: "idle", status: false});
    target = 'http://localhost:4000';

    execute (tasks: Task[]) {
        console.log('executing');
    }

    constructor () {

        this.socket = io(this.target);

        Observable.merge(
            Observable.fromEvent(this.socket, 'connect').mapTo({type: "connect", status: true}),
            Observable.fromEvent(this.socket, 'reconnect_attempt').mapTo({type: "reconnect_attempt", status: false}),
            Observable.fromEvent(this.socket, 'reconnect').mapTo({type: "reconnect", status: true}),
            Observable.fromEvent(this.socket, 'disconnect').mapTo({type: "disconnect", status: false}),
        )
            .do(x => console.log(`Socket connection status`, x))
            .subscribe(this.connection$);

        this.task$ = new BehaviorSubject<IncomingTask[]>([]);

        this.socket.on('TopLevelTasks', (_tasks: IncomingTask[]) => {
            this.task$.next(_tasks);
        });

        // const execReport$ = Observable.fromEvent(socket, 'execute-report');
        // const complete$   = execReport$.filter(x => x.data.type === 'Complete');
        //
        // function execute (tasks) {
        //
        //     const id = '01';
        //
        //     return Observable
        //         .just(true)
        //         .do(x => {
        //             socket.emit('execute', {
        //                 id,
        //                 cli: {
        //                     input: ['run'].concat(tasks),
        //                     flags: {}
        //                 }
        //             });
        //         })
        //         .flatMap(function () {
        //             return execReport$
        //                 .filter(x => x.origin === id)
        //                 .takeUntil(complete$.filter(x => x.origin === id));
        //         }).map(x => x.data);
        // }

    }
}
