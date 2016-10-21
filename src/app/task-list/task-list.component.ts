import {Component, OnInit} from '@angular/core';
import {TasksService, IncomingTask, SocketConnection} from "../tasks.service";
import {RunCommandReport} from "crossbow/dist/command.run.execute";
import {TaskReport} from "crossbow/dist/task.runner";
import {Observable, BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-task-list',
    template: `
<div *ngIf="!connection.status">
    <p>Waiting for a connection from {{tasks.target}}</p>
    <p>Status: {{connection.type}}</p>
</div>
<ul class="task-list" *ngIf="connection.status">
    <li *ngFor="let task of task$ | async" class="task-list__item" 
    [ngClass]="{'task-list__item--expanded': task.expanded}">
        <div class="task-list__item-header">
            <pre>{{task.name}}</pre>
            <span class="icon task-list__toggle" (click)="expand(task)">
                <i class="material-icons">expand_more</i>
            </span>
        </div>
        <app-task-item *ngIf="task.expanded" 
        [task]="task"
        (outgoing)="incoming($event)"></app-task-item>
    </li>
</ul>
`,
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

    expanded: string[] = [];
    connection: SocketConnection;
    task$ = new BehaviorSubject<IncomingTask[]>([]);
    stats = {};

    constructor(private tasks: TasksService) {
        tasks.connection$.subscribe(x => this.connection = x);
        tasks.task$
            .map(x => {
                return x.map(c => {
                    c.expanded = false;
                    return c;
                })
            })
            .subscribe(x => this.task$.next(x));
    }

    isExpanded(task: IncomingTask): boolean {
        return this.expanded.filter(x => x === task.name).length > 0;
    }

    expand(task: IncomingTask) {
        task.expanded = !task.expanded;
    }

    incoming (incomingEvent: {type: string, data: IncomingTask}) {
        if (incomingEvent.type === 'execute') {
            this.tasks.execute(incomingEvent.data)
                .subscribe((x) => {
                    if (x.type === 'TaskReport') {
                        const current = this.task$.getValue();
                        // todo decorate seq with reports
                        this.stats[x.data.item.seqUID] = x.data.stats;
                    }
                });
        }
    }

    ngOnInit() {

    }
}
