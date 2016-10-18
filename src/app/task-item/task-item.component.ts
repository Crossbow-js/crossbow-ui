import {Component, OnInit, EventEmitter} from '@angular/core';
import {Input, Output} from "@angular/core/src/metadata/directives";
import {IncomingTask} from "../tasks.service";

@Component({
    selector: 'app-task-item',
    template: `
<div>
    <p>Tasks Ready
        <span class="icon icon--bg icon--bg-complete" (click)="outgoing.emit({type: 'execute', data: task})">
            <i class="material-icons">play_circle_filled</i>
        </span>
    </p>
    <app-runnables [seq]="task.runner.sequence[0].items"></app-runnables>
</div>
`,
    styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

    @Input() task: IncomingTask;
    @Output() outgoing = new EventEmitter();

    constructor() {

    }

    ngOnInit() {
    }

}
