import { FormControl } from '@angular/forms';
import { getControlErrorMessage } from './form-error-message';

describe('getControlErrorMessage', () => {
  it('GIVEN control null THEN retorna null', () => {
    expect(getControlErrorMessage(null)).toBeNull();
  });

  it('GIVEN control sin errores THEN retorna null', () => {
    const c = new FormControl('x');
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBeNull();
  });

  it('GIVEN errores pero no touched ni dirty THEN retorna null (edge case)', () => {
    const c = new FormControl('', { validators: () => ({ required: true }) });
    expect(getControlErrorMessage(c)).toBeNull();
  });

  it('GIVEN required y touched THEN mensaje obligatorio', () => {
    const c = new FormControl('');
    c.setErrors({ required: true });
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('Campo obligatorio');
  });

  it('GIVEN email invalido y dirty THEN mensaje email', () => {
    const c = new FormControl('no-at');
    c.setErrors({ email: true });
    c.markAsDirty();
    expect(getControlErrorMessage(c)).toBe('Formato de email no valido');
  });

  it('GIVEN minlength y touched THEN incluye longitud requerida', () => {
    const c = new FormControl('ab');
    c.setErrors({ minlength: { requiredLength: 5, actualLength: 2 } });
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('Minimo 5 caracteres');
  });

  it('GIVEN maxlength y touched THEN incluye maximo', () => {
    const c = new FormControl('abcdef');
    c.setErrors({ maxlength: { requiredLength: 3, actualLength: 6 } });
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('Maximo 3 caracteres');
  });

  it('GIVEN whitespace y touched THEN mensaje vacio', () => {
    const c = new FormControl('  ');
    c.setErrors({ whitespace: true });
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('No puede estar vacio');
  });

  it('GIVEN pattern y touched THEN mensaje padron', () => {
    const c = new FormControl('x');
    c.setErrors({ pattern: { requiredPattern: '.*' } });
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('Formato no valido');
  });

  it('GIVEN error desconocido y touched THEN valor generico', () => {
    const c = new FormControl('x');
    c.setErrors({ custom: true } as never);
    c.markAsTouched();
    expect(getControlErrorMessage(c)).toBe('Valor no valido');
  });
});
