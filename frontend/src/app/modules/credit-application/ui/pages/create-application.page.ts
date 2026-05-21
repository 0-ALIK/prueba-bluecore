import { Component } from '@angular/core';
import { CreditApplicationFormWidget } from '../widgets/credit-application-form.widget';

@Component({
  selector: 'create-application-page',
  imports: [CreditApplicationFormWidget],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Crear solicitud de credito</h1>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <credit-application-form (submitted)="onSubmitted()" />
      </div>
    </div>
  `,
})
export class CreateApplicationPage {
  protected onSubmitted(): void {
    alert('Solicitud creada exitosamente');
  }
}
