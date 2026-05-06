import { AbstractControl, ValidatorFn } from '@angular/forms';

/** Rechaza cadenas vacias o solo espacios (utiles con trim en el servicio). */
export const notWhitespace: ValidatorFn = (control: AbstractControl) => {
  const v = control.value;
  if (v == null || String(v).trim().length === 0) {
    return { whitespace: true };
  }
  return null;
};
