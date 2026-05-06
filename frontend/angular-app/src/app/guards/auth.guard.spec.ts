import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  UrlTree,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('GIVEN autenticado THEN true', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: () => true } },
      ],
    });
    const r = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(r).toBe(true);
  });

  it('GIVEN no autenticado THEN UrlTree hacia /login (edge)', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
      ],
    });
    const r = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(r).toBeInstanceOf(UrlTree);
    const tree = r as UrlTree;
    expect(tree.toString()).toContain('login');
  });
});
