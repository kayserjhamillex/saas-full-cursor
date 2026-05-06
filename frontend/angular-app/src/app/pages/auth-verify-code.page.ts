import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getControlErrorMessage } from '../shared/forms/form-error-message';
import { DsButtonComponent, DsInputComponent } from '../shared/ui';
import { notWhitespace } from '../shared/forms/validators';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DsInputComponent, DsButtonComponent],
  template: `
    <div class="auth-page">
      <section class="auth-card">
        <div class="auth-card__brand">
          <span class="auth-card__logo" aria-hidden="true"></span>
          <span class="auth-card__brand-name">Admin SaaS</span>
        </div>
        <header class="auth-card__header">
          <h2 class="auth-card__title">Verificar codigo</h2>
          <p class="auth-card__sub">Valida el codigo recibido para habilitar cambio de password.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <ds-input
            label="Email"
            inputId="verify-email"
            type="email"
            formControlName="email"
            [error]="err('email')"
          />
          <ds-input
            label="Tenant ID"
            inputId="verify-tenant"
            type="text"
            formControlName="tenantId"
            [error]="err('tenantId')"
          />
          <ds-input
            label="Codigo"
            inputId="verify-code"
            type="text"
            formControlName="code"
            [error]="err('code')"
          />

          <ds-button type="submit">Verificar codigo</ds-button>
          <div class="auth-card__links">
            <a routerLink="/update-password">Continuar a update password</a>
          </div>
        </form>

        @if (message) {
          <p class="msg">{{ message }}</p>
        }
      </section>
    </div>
  `,
  styles: `
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
    .auth-card { width: min(440px, 100%); background: var(--surface); border: 1px solid var(--border); border-radius: 1.1rem; overflow: hidden; box-shadow: 0 4px 24px -4px rgba(16, 33, 49, 0.12), 0 1px 0 rgba(16, 33, 49, 0.04); }
    .auth-card__brand { display: flex; align-items: center; gap: 0.6rem; padding: 1.25rem 1.75rem 1rem; border-bottom: 1px solid var(--border); }
    .auth-card__logo { display: block; width: 1.6rem; height: 1.6rem; border-radius: 0.45rem; background: linear-gradient(135deg, #2f6f91, #4f8fb1); flex-shrink: 0; }
    .auth-card__brand-name { font-size: 0.9rem; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
    .auth-card__header { padding: 1.5rem 1.75rem 0.5rem; }
    .auth-card__title { margin: 0 0 0.35rem; font-size: 1.3rem; font-weight: 700; color: var(--text); letter-spacing: -0.025em; }
    .auth-card__sub { margin: 0; font-size: 0.875rem; color: var(--muted); line-height: 1.5; }
    form { display: grid; gap: 0.85rem; padding: 1.25rem 1.75rem 1.5rem; }
    .auth-card__links { display: flex; justify-content: flex-end; margin-top: 0.15rem; }
    a { color: var(--primary-strong); text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color 0.15s ease; }
    a:hover { color: var(--primary); text-decoration: underline; }
    .msg { margin: 0 1.75rem 1.25rem; background: rgba(79, 143, 177, 0.1); border: 1px solid rgba(79, 143, 177, 0.25); padding: 0.65rem 0.85rem; border-radius: 0.6rem; font-size: 0.875rem; color: var(--text); line-height: 1.4; }
  `,
})
export class AuthVerifyCodePage {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: [
      sessionStorage.getItem('recover_email') ?? '',
      [Validators.required, Validators.email, Validators.maxLength(200)],
    ],
    tenantId: [
      sessionStorage.getItem('recover_tenant') ?? this.auth.tenantId(),
      [Validators.required, Validators.maxLength(120), notWhitespace],
    ],
    code: ['', [Validators.required, Validators.maxLength(80), notWhitespace]],
  });

  message = '';

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message = 'Revisa los campos del formulario.';
      return;
    }

    this.message = '';
    const dto = this.form.getRawValue();
    try {
      await this.auth.verifyCode(dto.email, dto.tenantId, dto.code);
      this.message = 'Codigo verificado.';
      sessionStorage.setItem('recover_code', dto.code);
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Error en verificacion';
    }
  }

  protected err(name: 'email' | 'tenantId' | 'code'): string | null {
    return getControlErrorMessage(this.form.get(name));
  }
}
