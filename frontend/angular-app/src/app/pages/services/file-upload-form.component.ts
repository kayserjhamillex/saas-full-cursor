import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import type {
  FileUploadFormFields,
  PreparedLocalFile,
} from '../../services/services-integrations.service';
import { ServicesIntegrationsService } from '../../services/services-integrations.service';
import { getControlErrorMessage } from '../../shared/forms/form-error-message';
import type { IntegrationStatus } from '../../shared/integration/integration-status.model';
import {
  errStatus,
  fromFileUploadResult,
  integrationClear,
} from '../../shared/integration/integration-status.util';
import { toBusyViewModel$ } from '../../shared/rx/run-with-busy-state';

@Component({
  selector: 'app-file-upload-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    @if (vm$ | async; as vm) {
      <form class="form form--panel" [formGroup]="form" (ngSubmit)="onSubmit()">
        <h4>File Service (upload IA)</h4>
        <label>
          Patient ID
          <input
            type="text"
            formControlName="patientId"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.patientId.invalid && form.controls.patientId.touched"
          />
        </label>
        @if (form.controls.patientId.touched && form.controls.patientId.invalid) {
          <span class="field-error" role="alert">{{ err('patientId') }}</span>
        }
        <label>
          Encounter ID
          <input
            type="text"
            formControlName="encounterId"
            [disabled]="vm.busy"
            [attr.aria-invalid]="
              form.controls.encounterId.invalid && form.controls.encounterId.touched
            "
          />
        </label>
        @if (form.controls.encounterId.touched && form.controls.encounterId.invalid) {
          <span class="field-error" role="alert">{{ err('encounterId') }}</span>
        }
        <label>
          Modulo fuente
          <input
            type="text"
            formControlName="sourceModule"
            [disabled]="vm.busy"
            [attr.aria-invalid]="
              form.controls.sourceModule.invalid && form.controls.sourceModule.touched
            "
          />
        </label>
        @if (form.controls.sourceModule.touched && form.controls.sourceModule.invalid) {
          <span class="field-error" role="alert">{{ err('sourceModule') }}</span>
        }
        <label>
          Archivo
          <input type="file" (change)="onFileSelected($event)" [disabled]="vm.busy" />
        </label>
        @if (fileMissingError()) {
          <span class="field-error" role="alert">Selecciona un archivo</span>
        }
        <button type="submit" [disabled]="vm.busy">
          {{ vm.busy ? 'Subiendo...' : 'Subir archivo' }}
        </button>
        <small>Uso recomendado: guardar imagen enviada a IA para reconsulta.</small>
      </form>
    }
  `,
  styleUrl: './integration-form.shared.scss',
})
export class FileUploadFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly integrations = inject(ServicesIntegrationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly upload$ = new Subject<void>();
  private readonly filePick$ = new Subject<Event>();

  private readonly filePrepared = toSignal(
    this.filePick$.pipe(switchMap((e) => this.integrations.prepareFileFromInput$(e))),
    { initialValue: null as PreparedLocalFile | null },
  );

  protected readonly fileMissingError = signal(false);

  readonly integrationStatus = output<IntegrationStatus>();
  readonly fileIdSuggested = output<string>();
  readonly formActivity = output<boolean>();

  readonly form = this.fb.nonNullable.group({
    patientId: ['', [Validators.required, Validators.maxLength(120)]],
    encounterId: ['', [Validators.required, Validators.maxLength(120)]],
    sourceModule: ['clinical', [Validators.required, Validators.maxLength(64)]],
  });

  readonly vm$ = toBusyViewModel$(
    this.upload$,
    () => this.integrations.uploadFileOrMessage$(this.getFormFields(), this.filePrepared() ?? null),
    () => this.integrationStatus.emit(integrationClear),
    (r) => {
      this.integrationStatus.emit(fromFileUploadResult(r.message));
      if (r.fileId) {
        this.fileIdSuggested.emit(r.fileId);
      }
    },
    (b) => this.formActivity.emit(b),
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.upload$.complete();
      this.filePick$.complete();
    });
  }

  onFileSelected(event: Event) {
    this.fileMissingError.set(false);
    this.filePick$.next(event);
  }

  onSubmit() {
    this.fileMissingError.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.integrationStatus.emit(errStatus('Revisa los campos del formulario.'));
      return;
    }
    if (!this.filePrepared()) {
      this.fileMissingError.set(true);
      this.integrationStatus.emit(errStatus('Debes elegir un archivo valido para subir.'));
      return;
    }
    this.integrationStatus.emit(integrationClear);
    this.upload$.next();
  }

  protected err(name: 'patientId' | 'encounterId' | 'sourceModule'): string | null {
    return getControlErrorMessage(this.form.get(name));
  }

  private getFormFields(): FileUploadFormFields {
    return this.form.getRawValue();
  }
}
