import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { Component, computed, inject, OnInit } from '@angular/core';
import {  NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { TodoKeyLocalStorage } from 'src/app/models/enum/totoKeyLocalStorage';
import { Todo } from 'src/app/models/model/todo.model';
import {  MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: []
})
export class TodoCardComponent implements OnInit{


  private todoSignalsService = inject(TodoSignalsService);
  private todosSignal = this.todoSignalsService.todosState;
  public todosList = computed(() => this.todosSignal());

  public ngOnInit(): void {
    this.getTodosInLocalStorage()
  }


  private getTodosInLocalStorage() {
   const todosDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
   todosDatas && this.todosSignal.set(JSON.parse(todosDatas))
  }

  private saveTodosInLocaLStorage(): void {
    this.todoSignalsService.saveTodosInLocalStorege();
  }

  public handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todosSignal.mutate((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;
        todoSelected && (todoSelected.done = true);
        this.saveTodosInLocaLStorage()
      })
    }
  }

public handleDeleteTodo(todo: Todo) :void {
  if (todo) {
    const index = this.todosList().indexOf(todo);

    if(index !== -1) {
      this.todosSignal.mutate((todos) => {
        todos.splice(index, 1);
        this.saveTodosInLocaLStorage();
      })
    }
  }
}

}
