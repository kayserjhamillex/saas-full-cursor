import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, model, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge, of, Subject } from 'rxjs';
import { exhaustMap, finalize, map, tap } from 'rxjs/operators';
import { getControlErrorMessage } from '../../shared/forms/form-error-message';
import { notWhitespace } from '../../shared/forms/validators';
import type { IntegrationStatus } from '../../shared/integration/integration-status.model';
import {
  errStatus,
  fromFileMetadata,
  integrationClear,
} from '../../shared/integration/integration-status.util';
import { ServicesIntegrationsService } from '../../services/services-integrations.service';

type FileMetaVm = { busy: boolean; data: unknown | null };

@Component({
  selector: 'app-file-metadata-form',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
  template: `
    @if (vm$ | async; as vm) {
      <form class="form form--panel" [formGroup]="form" (ngSubmit)="onSubmit()">
        <h4>File Service (metadata)</h4>
        <label>
          File ID
          <input
            type="text"
            formControlName="fileId"
            [disabled]="vm.busy"
            [attr.aria-invalid]="form.controls.fileId.invalid && form.controls.fileId.touched"
          />
        </label>
        @if (form.controls.fileId.touched && form.controls.fileId.invalid) {
          <span class="field-error" role="alert">{{ fileIdError() }}</span>
        }
        <button type="submit" [disabled]="vm.busy">
          {{ vm.busy ? 'Consultando...' : 'Consultar metadata' }}
        </button>
        @if (vm.data) {
          <pre>{{ vm.data | json }}</pre>
        }
      </form>
    }
  `,
  styleUrl: './integration-form.shared.scss',
})
export class FileMetadataFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly integrations = inject(ServicesIntegrationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly run$ = new Subject<void>();

  /** Sincronizado con la pagina (p. ej. rellenado al subir un archivo) */
  readonly fileId = model('');

  readonly form = this.fb.nonNullable.group({
    fileId: ['', [Validators.required, notWhitespace, Validators.maxLength(200)]],
  });

  readonly integrationStatus = output<IntegrationStatus>();
  readonly formActivity = output<boolean>();

  readonly vm$ = merge(
    of<FileMetaVm>({ busy: false, data: null }),
    this.run$.pipe(
      tap({ next: () => this.integrationStatus.emit(integrationClear) }),
      exhaustMap(() => {
        this.formActivity.emit(true);
        const id = this.form.get('fileId')!.value;
        return merge(
          of<FileMetaVm>({ busy: true, data: null }),
          this.integrations.resolveFileMetadata$(id).pipe(
            map((r) => {
              this.integrationStatus.emit(fromFileMetadata(r.message));
              return { busy: false, data: r.data } as FileMetaVm;
            }),
            finalize(() => this.formActivity.emit(false)),
          ),
        );
      }),
    ),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.run$.complete());

    this.form
      .get('fileId')!
      .valueChanges.pipe(
        takeUntilDestroyed(),
        map((v) => (v == null ? '' : String(v))),
      )
      .subscribe((v) => {
        if (v !== this.fileId()) {
          this.fileId.set(v);
        }
      });

    effect(() => {
      const ext = this.fileId();
      const cur = this.form.get('fileId')?.value ?? '';
      if (ext !== cur) {
        this.form.patchValue({ fileId: ext }, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.integrationStatus.emit(errStatus('Revisa el identificador del archivo.'));
      return;
    }
    this.integrationStatus.emit(integrationClear);
    this.run$.next();
  }

  protected fileIdError(): string | null {
    return getControlErrorMessage(this.form.get('fileId'));
  }
}
