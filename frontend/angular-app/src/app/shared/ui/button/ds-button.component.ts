import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ds-button',
  standalone: true,
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading || null"
      [attr.aria-disabled]="disabled && !loading ? true : null"
      class="ds-btn"
      [class.ds-btn--primary]="variant === 'primary'"
      [class.ds-btn--secondary]="variant === 'secondary'"
      [class.ds-btn--ghost]="variant === 'ghost'"
      [class.ds-btn--danger]="variant === 'danger'"
      [class.ds-btn--sm]="size === 'sm'"
      [class.ds-btn--md]="size === 'md'"
      [class.ds-btn--lg]="size === 'lg'"
      [class.ds-btn--loading]="loading"
    >
      <span class="ds-btn__spinner" [class.ds-btn__spinner--on]="loading" aria-hidden="true"></span>
      <span class="ds-btn__content">
        <ng-content />
      </span>
    </button>
  `,
  styleUrl: './ds-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ds-button-host' },
})
export class DsButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
