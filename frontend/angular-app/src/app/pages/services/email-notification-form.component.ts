import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import type { SendEmailRequest } from '../../core/api/notifications-api.service';
import { getControlErrorMessage } from '../../shared/forms/form-error-message';
import type { IntegrationStatus } from '../../shared/integration/integration-status.model';
import {
  fromEmailWhatsappServiceMessage,
  errStatus,
  integrationClear,
} from '../../shared/integration/integration-status.util';
import { ServicesIntegrationsService } from '../../services/services-integrations.service';
import { toBusyViewModel$ } from '../../shared/rx/run-with-busy-state';

@Component({
  selector: 'app-email-notification-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    @if (vm$ | async; as vm) {
      <form class="form form--panel" [formGroup]="form" (ngSubmit)="onSubmit()">
        <h4>Correo</h4>
        <label>
          Destino
          <input
            type="email"
            formControlName="to"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.to.invalid && form.controls.to.touched"
          />
        </label>
        @if (form.controls.to.touched && form.controls.to.invalid) {
          <span class="field-error" role="alert">{{ err('to') }}</span>
        }
        <label>
          Asunto
          <input
            type="text"
            formControlName="subject"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.subject.invalid && form.controls.subject.touched"
          />
        </label>
        @if (form.controls.subject.touched && form.controls.subject.invalid) {
          <span class="field-error" role="alert">{{ err('subject') }}</span>
        }
        <label>
          Template
          <input
            type="text"
            formControlName="template"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.template.invalid && form.controls.template.touched"
          />
        </label>
        @if (form.controls.template.touched && form.controls.template.invalid) {
          <span class="field-error" role="alert">{{ err('template') }}</span>
        }
        <label>
          Paciente
          <input type="text" formControlName="patientName" [disabled]="vm.busy" />
        </label>
        @if (form.controls.patientName.touched && form.controls.patientName.invalid) {
          <span class="field-error" role="alert">{{ err('patientName') }}</span>
        }
        <label>
          Fecha cita
          <input type="text" formControlName="appointmentDate" [disabled]="vm.busy" />
        </label>
        @if (form.controls.appointmentDate.touched && form.controls.appointmentDate.invalid) {
          <span class="field-error" role="alert">{{ err('appointmentDate') }}</span>
        }
        <button type="submit" [disabled]="vm.busy">
          {{ vm.busy ? 'Enviando...' : 'Enviar correo' }}
        </button>
      </form>
    }
  `,
  styleUrl: './integration-form.shared.scss',
})
export class EmailNotificationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly integrations = inject(ServicesIntegrationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly submit$ = new Subject<void>();

  /** Estado global de la accion: mensaje + tono (sin interpretacion por regex en la pagina). */
  readonly integrationStatus = output<IntegrationStatus>();
  /** `true` mientras la peticion HTTP esta en curso (estado de carga a nivel de pagina). */
  readonly formActivity = output<boolean>();

  readonly form = this.fb.nonNullable.group({
    to: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    template: ['appointment_reminder', [Validators.required, Validators.maxLength(100)]],
    patientName: ['', [Validators.maxLength(200)]],
    appointmentDate: ['', [Validators.maxLength(100)]],
  });

  readonly vm$ = toBusyViewModel$(
    this.submit$,
    () => this.integrations.sendEmail$(this.getDto()),
    () => this.integrationStatus.emit(integrationClear),
    (message) => this.integrationStatus.emit(fromEmailWhatsappServiceMessage(message)),
    (b) => this.formActivity.emit(b),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.submit$.complete());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.integrationStatus.emit(errStatus('Revisa los campos del formulario.'));
      return;
    }
    this.integrationStatus.emit(integrationClear);
    this.submit$.next();
  }

  protected err(
    name: 'to' | 'subject' | 'template' | 'patientName' | 'appointmentDate',
  ): string | null {
    return getControlErrorMessage(this.form.get(name));
  }

  private getDto(): SendEmailRequest {
    return this.form.getRawValue();
  }
}
