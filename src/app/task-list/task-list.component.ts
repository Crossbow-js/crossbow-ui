import {Component, OnInit} from '@angular/core';
import {TasksService, IncomingTask} from "../tasks.service";
import {Task} from "crossbow/dist/task.resolve";


@Component({
    selector: 'app-task-list',
    template: `
<div>
    <ul class="task-list">
        <li *ngFor="let task of tasks.task$ | async" 
        class="task-list__item" 
        [ngClass]="{'task-list__item--expanded': isExpanded(task)}">
        
            <div class="task-list__item-header">
                <pre>{{task.name}}</pre>
                <span class="icon task-list__toggle" (click)="expand(task)">
                    <i class="material-icons">expand_more</i>
                </span>
            </div>
            
            <div class="task-list__actions" *ngIf="isExpanded(task)">
                <p>Tasks Ready 
                    <span class="icon icon--bg icon--bg-complete">
                        <i class="material-icons">play_circle_filled</i>
                    </span>
                </p>
                <ul class="task-list__runnables runnables">
                    <li *ngFor="let seqItem of task.runner.sequence[0].items" class="runnables__item">
                        <span class="icon icon--bg icon--bg-idle">
                            <i class="material-icons">more_horiz</i>
                        </span>
                        {{seqItem.stats}}
                        {{seqItem.task.taskName}}
                    </li>  
                </ul>
            </div>
        </li>
    </ul>
</div>
`,
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

    expanded: string[] = [];

    constructor(private tasks: TasksService) {
    }


    isExpanded(task): boolean {
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

    ngOnInit() {

    }
}
