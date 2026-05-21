import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterFormWidget } from '../widgets/register-form.widget';

@Component({
  selector: 'register-page',
  imports: [RegisterFormWidget, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p class="text-sm text-gray-500 mt-1">Completa el formulario para registrarte</p>
          </div>

          <register-form />

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes cuenta?
              <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterPage {
}
