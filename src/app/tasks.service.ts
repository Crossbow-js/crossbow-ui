import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import "rxjs/add/observable/merge";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/of";
import {SequenceItem} from "crossbow/dist/task.sequence.factories";
import {Task} from "crossbow/dist/task.resolve";
import {TaskReport} from "crossbow/dist/task.runner";
import {RunComplete, RunCommandReport, RunCommandCompletionReport} from "crossbow/dist/command.run.execute";
import {RunCommandSetup} from "crossbow/dist/command.run";
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

export interface IncomingExecReport {
    origin: string,
    data: any
}

@Injectable()
export class TasksService {

    task$: Subject<IncomingTask[]>;
    socket: SocketIOClient.Socket;
    execReport$: Observable<IncomingExecReport>;
    complete$: Observable<IncomingExecReport>;
    connection$ = new BehaviorSubject<SocketConnection>({type: "idle", status: false});
    target = 'http://localhost:4000';
    id = 1;

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

        this.execReport$ = Observable.fromEvent<IncomingExecReport>(this.socket, 'execute-report');
        this.complete$   = this.execReport$.filter(x => x.data.type === 'Complete');
        this.execReport$.subscribe(x => {
            console.log(`ID:`, x.origin, x.data.type);
        });
    }

    execute (incomingTask: IncomingTask) {

        const thisId = String(this.id++);
        return Observable.of(true)
            .do(x => {
                this.socket.emit('execute', {
                    id: thisId,
                    cli: {
                        input: ['run'].concat(incomingTask.name),
                        flags: {}
                    }
                });
            })
            .flatMap(() => {
                return this.execReport$.filter(x => {
                    return x.origin === thisId;
                });
            })
            .map(x => x.data)
    }
}
