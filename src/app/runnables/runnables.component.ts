import {Component, OnInit} from '@angular/core';
import {SequenceItem} from "crossbow/dist/task.sequence.factories";
import {Input} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'app-runnables',
    templateUrl: './runnables.component.html',
    styleUrls: ['./runnables.component.scss']
})
export class RunnablesComponent implements OnInit {

    @Input() seq: SequenceItem[];
    @Input() level = 0;

    constructor() {
    }

    ngOnInit() {
    }

}
