import { Component, OnInit } from '@angular/core';
import {TasksService} from "../tasks.service";

@Component({
  selector: 'app-task-list',
  // templateUrl: './task-list.component.html',
  template: `
<p>My task list bro</p>
{{tasks.tasks$ | async}}

{{tasks.tasks$ | async}}
`,
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private tasks: TasksService) {
      console.log(window['io']);
      console.log(tasks);
  }

  ngOnInit() {

  }
}
