import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
  <div class="app">
  <h1>{{ title() }}</h1>
  <router-outlet></router-outlet>
  </div>
  `,
})
export class App {
  protected readonly title = signal('frontend');
}
