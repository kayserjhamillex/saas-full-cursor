import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthLoginPage } from './auth-login.page';

describe('AuthLoginPage', () => {
  let fixture: ComponentFixture<AuthLoginPage>;
  let page: AuthLoginPage;
  let loginMock: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    loginMock = vi.fn().mockResolvedValue(undefined);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AuthLoginPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            tenantId: () => 'tenant-test',
            login: loginMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLoginPage);
    page = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('GIVEN form invalido THEN no envia login', async () => {
    await page.submit();
    expect(loginMock).not.toHaveBeenCalled();
    expect(page.message).toContain('Revisa los campos');
  });

  it('GIVEN form valido THEN llama login y navega', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    page.form.setValue({
      email: 'qa@test.com',
      password: '123456',
      tenantId: 'tenant-test',
    });

    await page.submit();

    expect(loginMock).toHaveBeenCalledWith({
      email: 'qa@test.com',
      password: '123456',
      tenantId: 'tenant-test',
    });
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
