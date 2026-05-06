import { Component, computed, signal } from '@angular/core';
import type {
  IntegrationStatus,
  IntegrationTone,
} from '../../shared/integration/integration-status.model';
import { EmailNotificationFormComponent } from './email-notification-form.component';
import { FileMetadataFormComponent } from './file-metadata-form.component';
import { FileUploadFormComponent } from './file-upload-form.component';
import { WhatsappNotificationFormComponent } from './whatsapp-notification-form.component';

type ResultTone = 'idle' | 'info' | 'success' | 'error';

@Component({
  standalone: true,
  imports: [
    EmailNotificationFormComponent,
    WhatsappNotificationFormComponent,
    FileUploadFormComponent,
    FileMetadataFormComponent,
  ],
  template: `
    <div class="integrations">
      <header class="integrations__header">
        <p class="integrations__eyebrow">Integraciones</p>
        <h1 class="integrations__title">Notificaciones y almacenamiento</h1>
        <p class="integrations__lead">
          Conecta el panel con el API gateway: correo, WhatsApp y files para el flujo clinico/IA,
          con el mismo criterio de operacion en todos los entornos.
        </p>
      </header>

      <section
        class="integrations__state"
        role="region"
        aria-label="Resultado de la ultima accion"
        [attr.aria-live]="'polite'"
        [attr.aria-busy]="pageBusy()"
      >
        @if (pageBusy()) {
          <div class="state-card state-card--loading">
            <div class="state-card__row">
              <span class="spinner" aria-hidden="true"></span>
              <div>
                <p class="state-card__title">Procesando</p>
                <p class="state-card__text">Enlazando con el gateway, espera un momento.</p>
              </div>
            </div>
          </div>
        } @else if (!status) {
          <div class="state-card state-card--empty">
            <div class="state-card__icon state-card__icon--empty" aria-hidden="true"></div>
            <div>
              <p class="state-card__title">Listo para probar</p>
              <p class="state-card__text">
                Aun no hay resultados en esta sesion. Usa las tarjetas inferiores para enviar
                notificaciones o subir un archivo: el resumen de cada operacion aparecera aqui.
              </p>
            </div>
          </div>
        } @else if (resultTone() === 'error') {
          <div class="state-card state-card--error" role="alert">
            <div class="state-card__row">
              <span class="state-card__dot state-card__dot--error" aria-hidden="true"></span>
              <div>
                <p class="state-card__title">Atencion</p>
                <p class="state-card__text">{{ status }}</p>
              </div>
            </div>
          </div>
        } @else if (resultTone() === 'success') {
          <div class="state-card state-card--success" role="status">
            <div class="state-card__row">
              <span class="state-card__dot state-card__dot--ok" aria-hidden="true"></span>
              <div>
                <p class="state-card__title">Completado</p>
                <p class="state-card__text">{{ status }}</p>
              </div>
            </div>
          </div>
        } @else {
          <div class="state-card state-card--info">
            <div class="state-card__row">
              <span class="state-card__dot state-card__dot--info" aria-hidden="true"></span>
              <div>
                <p class="state-card__title">Aviso</p>
                <p class="state-card__text">{{ status }}</p>
              </div>
            </div>
          </div>
        }
      </section>

      <ul class="integrations__grid" aria-label="Herramientas de integracion">
        <li class="card-shell">
          <app-email-notification-form
            (integrationStatus)="setIntegrationStatus($event)"
            (formActivity)="onFormActivity($event)"
          />
        </li>
        <li class="card-shell">
          <app-whatsapp-notification-form
            (integrationStatus)="setIntegrationStatus($event)"
            (formActivity)="onFormActivity($event)"
          />
        </li>
        <li class="card-shell">
          <app-file-upload-form
            (integrationStatus)="setIntegrationStatus($event)"
            (fileIdSuggested)="onFileIdSuggested($event)"
            (formActivity)="onFormActivity($event)"
          />
        </li>
        <li class="card-shell">
          <app-file-metadata-form
            [(fileId)]="fileIdQuery"
            (integrationStatus)="setIntegrationStatus($event)"
            (formActivity)="onFormActivity($event)"
          />
        </li>
      </ul>
    </div>
  `,
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  private readonly activityDepth = signal(0);

  /** Profundidad de tareas asincronas (varios formularios pueden solapar momentaneamente). */
  readonly pageBusy = computed(() => this.activityDepth() > 0);

  status = '';
  private readonly tone = signal<ResultTone>('idle');
  /** Expuesto para la plantilla sin function en el if */
  protected readonly resultTone = this.tone.asReadonly();

  fileIdQuery = '';

  setIntegrationStatus(s: IntegrationStatus) {
    this.status = s.message;
    this.tone.set(this.mapToResultTone(s.tone));
  }

  private mapToResultTone(t: IntegrationTone): ResultTone {
    if (t === 'success') {
      return 'success';
    }
    if (t === 'error') {
      return 'error';
    }
    return 'info';
  }

  onFileIdSuggested(fileId: string) {
    this.fileIdQuery = fileId;
  }

  onFormActivity(active: boolean) {
    this.activityDepth.update((d) => {
      const next = d + (active ? 1 : -1);
      return next < 0 ? 0 : next;
    });
  }
}
