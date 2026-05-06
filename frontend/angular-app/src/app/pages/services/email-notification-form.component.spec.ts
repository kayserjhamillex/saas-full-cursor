import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IntegrationStatus } from '../../shared/integration/integration-status.model';
import {
  INTEGRATION_MESSAGES,
  ServicesIntegrationsService,
} from '../../services/services-integrations.service';
import { EmailNotificationFormComponent } from './email-notification-form.component';

@Component({
  selector: 'app-test-host',
  template: `<app-email-notification-form
    (integrationStatus)="messages.push($event)"
    (formActivity)="act.push($event)"
  />`,
  standalone: true,
  imports: [EmailNotificationFormComponent],
})
class TestHost {
  messages: IntegrationStatus[] = [];
  act: boolean[] = [];
}

function setupHost(integrations: { sendEmail$: ReturnType<typeof vi.fn> }) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [TestHost],
    providers: [
      {
        provide: ServicesIntegrationsService,
        useValue: integrations as unknown as ServicesIntegrationsService,
      },
    ],
  });
  return TestBed.createComponent(TestHost);
}

describe('EmailNotificationFormComponent (formularios + edge cases)', () => {
  let sendEmail$: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendEmail$ = vi.fn().mockReturnValue(of(INTEGRATION_MESSAGES.emailOk));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function getFormDe(fixture: ComponentFixture<TestHost>) {
    return fixture.debugElement.query(By.directive(EmailNotificationFormComponent)) as DebugElement;
  }

  it('GIVEN carga THEN muestra seccion de correo', async () => {
    const fixture = setupHost({ sendEmail$ });
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const de = getFormDe(fixture);
    expect(de).toBeTruthy();
    expect(de.nativeElement.textContent).toMatch(/Correo/);
  });

  it('GIVEN envio con campos vacios invalidos THEN marca touched y emite aviso (edge: submit sin datos)', async () => {
    const fixture = setupHost({ sendEmail$ });
    const host = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();

    const de = getFormDe(fixture);
    const inner = de.componentInstance as EmailNotificationFormComponent;
    const btn = de.query(By.css('button[type="submit"]'))?.nativeElement as
      | HTMLButtonElement
      | undefined;
    expect(btn).toBeTruthy();
    btn!.click();
    await fixture.whenStable();

    expect(inner.form.invalid).toBe(true);
    const last = host.messages[host.messages.length - 1];
    expect(last.tone).toBe('error');
    expect(last.message).toContain('Revisa los campos');
    expect(sendEmail$).not.toHaveBeenCalled();
  });

  it('GIVEN formulario valido y envio THEN emite correo e integra mensaje (caso feliz)', async () => {
    const fixture = setupHost({ sendEmail$ });
    const host = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();

    const de = getFormDe(fixture);
    const inner = de.componentInstance as EmailNotificationFormComponent;
    inner.form.setValue({
      to: 'ok@example.com',
      subject: 'Hola',
      template: 'appointment_reminder',
      patientName: '',
      appointmentDate: '',
    });
    const btn = de.query(By.css('button[type="submit"]'))?.nativeElement as
      | HTMLButtonElement
      | undefined;
    host.messages = [];
    btn!.click();
    await fixture.whenStable();

    expect(inner.form.valid).toBe(true);
    expect(sendEmail$).toHaveBeenCalled();
    const last = host.messages[host.messages.length - 1];
    expect(last.message).toBe(INTEGRATION_MESSAGES.emailOk);
    expect(last.tone).toBe('success');
  });

  it('GIVEN to con email invalido (edge) THEN al enviar muestra Revisa o errores y no dispara', async () => {
    const fixture = setupHost({ sendEmail$ });
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const de = getFormDe(fixture);
    const inner = de.componentInstance as EmailNotificationFormComponent;
    const host = fixture.componentInstance;
    inner.form.setValue({
      to: 'no-es-email',
      subject: 'S',
      template: 't',
      patientName: '',
      appointmentDate: '',
    });
    host.messages = [];
    (de.query(By.css('button[type="submit"]'))?.nativeElement as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(inner.form.controls.to.hasError('email')).toBe(true);
    expect(sendEmail$).not.toHaveBeenCalled();
  });

  it('GIVEN asunto y template demasiado largos (maxLength edge) THEN invalido y envio no llama', async () => {
    const fixture = setupHost({ sendEmail$ });
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const de = getFormDe(fixture);
    const inner = de.componentInstance as EmailNotificationFormComponent;
    inner.form.patchValue({
      to: 'ok@e.com',
      subject: 'x'.repeat(201),
      template: 'a'.repeat(101),
    });
    expect(inner.form.invalid).toBe(true);
    (de.query(By.css('button[type="submit"]'))?.nativeElement as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(sendEmail$).not.toHaveBeenCalled();
  });

  it('GIVEN servicio con mensaje de fallo (edge) THEN aun asi onResult emite', async () => {
    sendEmail$.mockReturnValue(of(INTEGRATION_MESSAGES.emailFail));
    const fixture = setupHost({ sendEmail$ });
    const host = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const de = getFormDe(fixture);
    const inner = de.componentInstance as EmailNotificationFormComponent;
    inner.form.setValue({
      to: 'ok@example.com',
      subject: 'H',
      template: 'appointment_reminder',
      patientName: '',
      appointmentDate: '',
    });
    host.messages = [];
    (de.query(By.css('button[type="submit"]'))?.nativeElement as HTMLButtonElement).click();
    await fixture.whenStable();
    const last = host.messages[host.messages.length - 1];
    expect(last.message).toBe(INTEGRATION_MESSAGES.emailFail);
    expect(last.tone).toBe('error');
  });
});
