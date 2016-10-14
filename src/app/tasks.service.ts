import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class TasksService {
  tasks$ = Observable.interval(1000);
  constructor() { }

}
