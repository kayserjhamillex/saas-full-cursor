import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Resuelve un único mensaje de error legible a partir de un control. */
export function getControlErrorMessage(control: AbstractControl | null): string | null {
  if (!control || !control.errors) {
    return null;
  }
  if (!control.touched && !control.dirty) {
    return null;
  }

  return mapErrors(control.errors);
}

function mapErrors(e: ValidationErrors): string {
  if (e['required']) {
    return 'Campo obligatorio';
  }
  if (e['email']) {
    return 'Formato de email no valido';
  }
  if (e['minlength'] && typeof e['minlength'] === 'object' && e['minlength'] !== null) {
    return `Minimo ${(e['minlength'] as { requiredLength: number }).requiredLength} caracteres`;
  }
  if (e['maxlength'] && typeof e['maxlength'] === 'object' && e['maxlength'] !== null) {
    return `Maximo ${(e['maxlength'] as { requiredLength: number }).requiredLength} caracteres`;
  }
  if (e['whitespace']) {
    return 'No puede estar vacio';
  }
  if (e['pattern']) {
    return 'Formato no valido';
  }
  return 'Valor no valido';
}
