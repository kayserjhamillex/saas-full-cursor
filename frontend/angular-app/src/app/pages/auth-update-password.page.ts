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
          <h2 class="auth-card__title">Nueva password</h2>
          <p class="auth-card__sub">Actualiza password con codigo verificado.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <ds-input
            label="Email"
            inputId="update-email"
            type="email"
            formControlName="email"
            [error]="err('email')"
          />
          <ds-input
            label="Tenant ID"
            inputId="update-tenant"
            type="text"
            formControlName="tenantId"
            [error]="err('tenantId')"
          />
          <ds-input
            label="Codigo"
            inputId="update-code"
            type="text"
            formControlName="code"
            [error]="err('code')"
          />
          <ds-input
            label="Nueva password"
            inputId="update-password"
            type="password"
            formControlName="password"
            [error]="err('password')"
          />
          <ds-input
            label="Confirmar password"
            inputId="update-confirm-password"
            type="password"
            formControlName="confirmPassword"
            [error]="err('confirmPassword')"
          />

          <ds-button type="submit">Actualizar password</ds-button>
          <div class="auth-card__links">
            <a routerLink="/login">Volver a login</a>
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
export class AuthUpdatePasswordPage {
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
    code: [
      sessionStorage.getItem('recover_code') ?? '',
      [Validators.required, Validators.maxLength(80), notWhitespace],
    ],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(128)],
    ],
  });

  message = '';

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message = 'Revisa los campos del formulario.';
      return;
    }

    const dto = this.form.getRawValue();
    if (dto.password !== dto.confirmPassword) {
      this.message = 'Las passwords no coinciden';
      return;
    }

    this.message = '';
    try {
      await this.auth.updatePassword(dto.email, dto.tenantId, dto.code, dto.password);
      this.message = 'Password actualizada. Ya puedes iniciar sesion.';
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Error al actualizar password';
    }
  }

  protected err(
    name: 'email' | 'tenantId' | 'code' | 'password' | 'confirmPassword',
  ): string | null {
    return getControlErrorMessage(this.form.get(name));
  }
}
