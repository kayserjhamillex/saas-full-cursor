import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'ds-table',
  standalone: true,
  template: `
    <div
      class="ds-table-wrap"
      role="region"
      [attr.aria-label]="ariaLabel || null"
      [attr.tabindex]="scrollable ? 0 : null"
    >
      <table
        class="ds-table"
        [class.ds-table--striped]="striped"
        [class.ds-table--compact]="compact"
      >
        @if (caption) {
          <caption class="ds-table__caption">
            {{
              caption
            }}
          </caption>
        }
        <ng-content />
      </table>
    </div>
  `,
  styleUrl: './ds-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ds-table-host' },
})
export class DsTableComponent {
  @Input() caption = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) striped = true;
  @Input({ transform: booleanAttribute }) compact = false;
  /** Permite foco en el contenedor para desplazamiento con teclado. */
  @Input({ transform: booleanAttribute }) scrollable = true;
}
