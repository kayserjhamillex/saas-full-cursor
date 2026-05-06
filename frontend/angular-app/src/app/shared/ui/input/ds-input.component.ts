import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextInputId = 0;

@Component({
  selector: 'ds-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-in" [class.ds-in--invalid]="showError">
      @if (label) {
        <label class="ds-in__label" [for]="inputId">
          {{ label }}
          @if (optional) {
            <span class="ds-in__optional">(opcional)</span>
          }
        </label>
      }
      <input
        [id]="inputId"
        class="ds-in__field"
        [class.ds-in__field--invalid]="showError"
        [type]="type"
        [attr.name]="name"
        [attr.autocomplete]="autocomplete || null"
        [attr.placeholder]="placeholder || null"
        [attr.aria-describedby]="describedBy"
        [attr.aria-invalid]="showError"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      @if (hint && !showError) {
        <p class="ds-in__hint" [id]="hintId">{{ hint }}</p>
      }
      @if (errorText) {
        <p class="ds-in__error" [id]="errorId" role="alert">{{ errorText }}</p>
      }
    </div>
  `,
  styleUrl: './ds-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsInputComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() label = '';
  @Input() hint = '';
  /** Texto fijo; si se usa con FormControl, se puede vincular desde el padre leyendo errores. */
  @Input() error: string | null = null;
  @Input() type: 'text' | 'email' | 'password' | 'search' | 'url' = 'text';
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() placeholder = '';
  @Input() optional = false;
  @Input() inputId = `ds-in-${++nextInputId}`;

  @Input({ transform: booleanAttribute }) disabled = false;

  value = '';
  /** Refleja touched del CVA; no hace falta [touched] desde fuera. */
  touched = false;
  private onChange: (v: string) => void = () => {
    // noop
  };
  private onTouchedFn: () => void = () => {
    // noop
  };

  get errorText(): string | null {
    return this.error;
  }

  get showError(): boolean {
    return Boolean(this.touched && this.errorText);
  }

  get hintId() {
    return this.inputId + '-hint';
  }
  get errorId() {
    return this.inputId + '-err';
  }
  get describedBy(): string | null {
    const p: string[] = [];
    if (this.hint && !this.showError) {
      p.push(this.hintId);
    }
    if (this.errorText) {
      p.push(this.errorId);
    }
    return p.length ? p.join(' ') : null;
  }

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  onBlur() {
    if (!this.touched) {
      this.touched = true;
    }
    this.onTouchedFn();
  }

  writeValue(v: string | null) {
    this.value = v ?? '';
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: string) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouchedFn = fn;
  }
  setDisabledState(d: boolean) {
    this.disabled = d;
    this.cdr.markForCheck();
  }
}
