import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import type { SendWhatsappRequest } from '../../core/api/notifications-api.service';
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
  selector: 'app-whatsapp-notification-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    @if (vm$ | async; as vm) {
      <form class="form form--panel" [formGroup]="form" (ngSubmit)="onSubmit()">
        <h4>WhatsApp</h4>
        <label>
          Numero
          <input
            type="text"
            formControlName="phoneNumber"
            [disabled]="vm.busy"
            [attr.aria-invalid]="
              form.controls.phoneNumber.invalid && form.controls.phoneNumber.touched
            "
            inputmode="tel"
          />
        </label>
        @if (form.controls.phoneNumber.touched && form.controls.phoneNumber.invalid) {
          <span class="field-error" role="alert">{{ err('phoneNumber') }}</span>
        }
        <label>
          Mensaje
          <textarea
            formControlName="message"
            [disabled]="vm.busy"
            rows="3"
            [attr.aria-invalid]="form.controls.message.invalid && form.controls.message.touched"
          >
          </textarea>
        </label>
        @if (form.controls.message.touched && form.controls.message.invalid) {
          <span class="field-error" role="alert">{{ err('message') }}</span>
        }
        <label>
          Evento
          <input
            type="text"
            formControlName="eventType"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.eventType.invalid && form.controls.eventType.touched"
          />
        </label>
        @if (form.controls.eventType.touched && form.controls.eventType.invalid) {
          <span class="field-error" role="alert">{{ err('eventType') }}</span>
        }
        <button type="submit" [disabled]="vm.busy">
          {{ vm.busy ? 'Enviando...' : 'Enviar WhatsApp' }}
        </button>
      </form>
    }
  `,
  styleUrl: './integration-form.shared.scss',
})
export class WhatsappNotificationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly integrations = inject(ServicesIntegrationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly submit$ = new Subject<void>();

  readonly integrationStatus = output<IntegrationStatus>();
  readonly formActivity = output<boolean>();

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
    eventType: ['appointment_confirmation', [Validators.required, Validators.maxLength(80)]],
  });

  readonly vm$ = toBusyViewModel$(
    this.submit$,
    () => this.integrations.sendWhatsapp$(this.getDto()),
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

  protected err(name: 'phoneNumber' | 'message' | 'eventType'): string | null {
    return getControlErrorMessage(this.form.get(name));
  }

  private getDto(): SendWhatsappRequest {
    return this.form.getRawValue();
  }
}
