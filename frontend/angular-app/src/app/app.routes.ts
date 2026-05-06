import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth-login.page').then((m) => m.AuthLoginPage),
  },
  {
    path: 'recover',
    loadComponent: () => import('./pages/auth-recover.page').then((m) => m.AuthRecoverPage),
  },
  {
    path: 'verify-code',
    loadComponent: () => import('./pages/auth-verify-code.page').then((m) => m.AuthVerifyCodePage),
  },
  {
    path: 'update-password',
    loadComponent: () =>
      import('./pages/auth-update-password.page').then((m) => m.AuthUpdatePasswordPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/clients.page').then((m) => m.ClientsPage),
  },
  {
    path: 'tenants',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tenants.page').then((m) => m.TenantsPage),
  },
  {
    path: 'suscripciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/subscriptions.page').then((m) => m.SubscriptionsPage),
  },
  {
    path: 'pagos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/payments.page').then((m) => m.PaymentsPage),
  },
  {
    path: 'modulos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/modules.page').then((m) => m.ModulesPage),
  },
  {
    path: 'metricas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/metrics.page').then((m) => m.MetricsPage),
  },
  {
    path: 'ia',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ai.page').then((m) => m.AiPage),
  },
  {
    path: 'servicios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/services/services.page').then((m) => m.ServicesPage),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
