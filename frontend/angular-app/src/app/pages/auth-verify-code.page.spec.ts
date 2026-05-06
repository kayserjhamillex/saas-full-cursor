import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthVerifyCodePage } from './auth-verify-code.page';

describe('AuthVerifyCodePage', () => {
  let fixture: ComponentFixture<AuthVerifyCodePage>;
  let page: AuthVerifyCodePage;
  let verifyCodeMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sessionStorage.setItem('recover_email', 'verify@test.com');
    sessionStorage.setItem('recover_tenant', 'tenant-2');
    verifyCodeMock = vi.fn().mockResolvedValue({ ok: true });

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AuthVerifyCodePage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            tenantId: () => 'tenant-2',
            verifyCode: verifyCodeMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthVerifyCodePage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('GIVEN form invalido THEN no llama verifyCode', async () => {
    await page.submit();
    expect(verifyCodeMock).not.toHaveBeenCalled();
    expect(page.message).toContain('Revisa los campos');
  });

  it('GIVEN form valido THEN llama verifyCode y guarda codigo', async () => {
    page.form.setValue({
      email: 'verify@test.com',
      tenantId: 'tenant-2',
      code: '123456',
    });

    await page.submit();

    expect(verifyCodeMock).toHaveBeenCalledWith('verify@test.com', 'tenant-2', '123456');
    expect(sessionStorage.getItem('recover_code')).toBe('123456');
    expect(page.message).toContain('Codigo verificado');
  });
});
