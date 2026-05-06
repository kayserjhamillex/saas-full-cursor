import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthUpdatePasswordPage } from './auth-update-password.page';

describe('AuthUpdatePasswordPage', () => {
  let fixture: ComponentFixture<AuthUpdatePasswordPage>;
  let page: AuthUpdatePasswordPage;
  let updatePasswordMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sessionStorage.setItem('recover_email', 'qa@test.com');
    sessionStorage.setItem('recover_tenant', 'tenant-1');
    sessionStorage.setItem('recover_code', 'CODE-1');

    updatePasswordMock = vi.fn().mockResolvedValue(undefined);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AuthUpdatePasswordPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            tenantId: () => 'tenant-1',
            updatePassword: updatePasswordMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthUpdatePasswordPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('GIVEN passwords distintas THEN no llama update', async () => {
    page.form.setValue({
      email: 'qa@test.com',
      tenantId: 'tenant-1',
      code: 'CODE-1',
      password: '123456',
      confirmPassword: '654321',
    });

    await page.submit();

    expect(updatePasswordMock).not.toHaveBeenCalled();
    expect(page.message).toBe('Las passwords no coinciden');
  });

  it('GIVEN form valido THEN llama updatePassword', async () => {
    page.form.setValue({
      email: 'qa@test.com',
      tenantId: 'tenant-1',
      code: 'CODE-1',
      password: '123456',
      confirmPassword: '123456',
    });

    await page.submit();

    expect(updatePasswordMock).toHaveBeenCalledWith('qa@test.com', 'tenant-1', 'CODE-1', '123456');
    expect(page.message).toContain('Password actualizada');
  });
});
