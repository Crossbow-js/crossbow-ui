/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import {TasksService} from "../tasks.service";

describe('Component: TaskList', () => {
  it('should create an instance', () => {
    let component = new TaskListComponent(new TasksService());
    expect(component).toBeTruthy();
  });
});
