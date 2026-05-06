import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="page-wrap">
      <section class="page-card">
        <header class="page-card__header">
          <span class="page-card__eyebrow">Finanzas</span>
          <h3 class="page-card__title">Pagos</h3>
        </header>
        <div class="page-card__body">
          <p class="page-card__lead">Control de cobros, estados de transaccion y conciliacion basica.</p>
          <ul class="page-card__list">
            <li>Historial de pagos</li>
            <li>Pagos pendientes y fallidos</li>
            <li>Indicadores de recuperacion</li>
          </ul>
        </div>
        <footer class="page-card__footer">
          <span class="page-badge">En construccion</span>
        </footer>
      </section>
    </div>
  `,
  styles: `
    .page-wrap { padding: 0.25rem 0; }
    .page-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; overflow: hidden; box-shadow: 0 1px 0 rgba(16, 33, 49, 0.04), 0 4px 20px -4px rgba(16, 33, 49, 0.08); max-width: 640px; }
    .page-card__header { padding: 1.25rem 1.5rem 1rem; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.3rem; }
    .page-card__eyebrow { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary-strong); }
    .page-card__title { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
    .page-card__body { padding: 1.25rem 1.5rem; }
    .page-card__lead { margin: 0 0 1rem; font-size: 0.9rem; color: var(--muted); line-height: 1.55; }
    .page-card__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
    .page-card__list li { display: flex; align-items: center; gap: 0.6rem; font-size: 0.875rem; color: var(--muted); padding: 0.5rem 0.75rem; background: var(--surface-soft); border-radius: 0.5rem; border: 1px solid var(--border); }
    .page-card__list li::before { content: ''; display: block; width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--primary); flex-shrink: 0; }
    .page-card__footer { padding: 0.75rem 1.5rem; border-top: 1px solid var(--border); background: var(--surface-soft); }
    .page-badge { display: inline-block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); background: var(--border); padding: 0.2rem 0.6rem; border-radius: 999px; }
  `,
})
export class PaymentsPage {}
