import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthRecoverPage } from './auth-recover.page';

describe('AuthRecoverPage', () => {
  let fixture: ComponentFixture<AuthRecoverPage>;
  let page: AuthRecoverPage;
  let recoverMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    recoverMock = vi.fn().mockResolvedValue({ ok: true });

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AuthRecoverPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            tenantId: () => 'tenant-1',
            recover: recoverMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRecoverPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('GIVEN form invalido THEN no llama recover', async () => {
    await page.submit();
    expect(recoverMock).not.toHaveBeenCalled();
    expect(page.message).toContain('Revisa los campos');
  });

  it('GIVEN form valido THEN llama recover y guarda datos en session', async () => {
    page.form.setValue({
      email: 'recover@test.com',
      tenantId: 'tenant-1',
    });

    await page.submit();

    expect(recoverMock).toHaveBeenCalledWith('recover@test.com', 'tenant-1');
    expect(sessionStorage.getItem('recover_email')).toBe('recover@test.com');
    expect(sessionStorage.getItem('recover_tenant')).toBe('tenant-1');
    expect(page.message).toContain('Codigo enviado');
  });
});
