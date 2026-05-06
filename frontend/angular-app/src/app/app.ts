import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

const THEME_KEY = 'admin-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly links = [
    { path: '/', label: 'Dashboard' },
    { path: '/clientes', label: 'Clientes SaaS' },
    { path: '/tenants', label: 'Tenants' },
    { path: '/suscripciones', label: 'Suscripciones' },
    { path: '/pagos', label: 'Pagos' },
    { path: '/modulos', label: 'Modulos' },
    { path: '/metricas', label: 'Metricas' },
    { path: '/ia', label: 'IA y analitica' },
    { path: '/servicios', label: 'Servicios externos' },
  ] as const;
  private readonly initialTheme = (() => {
    if (typeof localStorage === 'undefined') {
      return 'light' as const;
    }
    const t = localStorage.getItem(THEME_KEY);
    return t === 'dark' ? 'dark' : 'light';
  })();

  /** Tema: signal para no forzar repintado del arbol en cada CD genérica. */
  protected readonly theme = signal<'light' | 'dark'>(this.initialTheme);
  protected readonly authService = inject(AuthService);

  constructor() {
    document.documentElement.setAttribute('data-theme', this.initialTheme);
  }

  isDarkTheme() {
    return this.theme() === 'dark';
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    const v = this.theme();
    document.documentElement.setAttribute('data-theme', v);
    try {
      localStorage.setItem(THEME_KEY, v);
    } catch {
      // sin localStorage (SSR / modo privado)
    }
  }

  logout() {
    this.authService.logout();
  }
}
