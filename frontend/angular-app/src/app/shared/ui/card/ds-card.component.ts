import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ds-card',
  standalone: true,
  template: `
    <section class="ds-card" [attr.data-elevation]="elevation">
      <header class="ds-card__header">
        <ng-content select="[ds-card-header]"></ng-content>
      </header>
      <div class="ds-card__body">
        <ng-content></ng-content>
      </div>
      <footer class="ds-card__footer">
        <ng-content select="[ds-card-footer]"></ng-content>
      </footer>
    </section>
  `,
  styleUrl: './ds-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ds-card-host' },
})
export class DsCardComponent {
  @Input() elevation: 'none' | 'sm' | 'md' = 'sm';
}
