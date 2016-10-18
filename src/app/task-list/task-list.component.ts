import {Component, OnInit} from '@angular/core';
import {TasksService, IncomingTask, SocketConnection} from "../tasks.service";

@Component({
    selector: 'app-task-list',
    template: `
<div *ngIf="!connection.status">
    <p>Waiting for a connection from {{tasks.target}}</p>
    <p>Status: {{connection.type}}</p>
</div>
<ul class="task-list" *ngIf="connection.status">
    <li *ngFor="let task of tasks.task$ | async" class="task-list__item" 
    [ngClass]="{'task-list__item--expanded': isExpanded(task)}">
        <div class="task-list__item-header">
            <pre>{{task.name}}</pre>
            <span class="icon task-list__toggle" (click)="expand(task)">
                <i class="material-icons">expand_more</i>
            </span>
        </div>
        <app-task-item *ngIf="isExpanded(task)" [task]="task" (outgoing)="incoming($event)"></app-task-item>
    </li>
</ul>
`,
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

    expanded: string[] = [];
    connection: SocketConnection;

    constructor(private tasks: TasksService) {
        tasks.connection$.subscribe(x => this.connection = x);
    }

    isExpanded(task: IncomingTask): boolean {
        return this.expanded.filter(x => x === task.name).length > 0;
    }

    expand(task: IncomingTask) {
        const isOpen = this.isExpanded(task);
        if (isOpen) {
            this.expanded = this.expanded.filter(x => x !== task.name);
        } else {
            this.expanded.push(task.name);
        }
    }

    incoming (incomingEvent: {type: string, data: IncomingTask}) {
        if (incomingEvent.type === 'execute') {
            this.tasks.execute(incomingEvent.data)
                .subscribe(x => {
                    console.log(x);
                });
        }
    }

    ngOnInit() {

    }
}
