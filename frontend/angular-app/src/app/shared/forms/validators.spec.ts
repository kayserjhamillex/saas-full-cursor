import { FormControl } from '@angular/forms';
import { notWhitespace } from './validators';

describe('notWhitespace', () => {
  it('GIVEN null THEN whitespace', () => {
    const c = new FormControl(null);
    expect(notWhitespace(c)).toEqual({ whitespace: true });
  });

  it('GIVEN string vacia THEN whitespace', () => {
    const c = new FormControl('');
    expect(notWhitespace(c)).toEqual({ whitespace: true });
  });

  it('GIVEN solo espacios THEN whitespace (edge case)', () => {
    const c = new FormControl('   \t\n  ');
    expect(notWhitespace(c)).toEqual({ whitespace: true });
  });

  it('GIVEN texto con contenido real THEN null', () => {
    const c = new FormControl('  hola  ');
    expect(notWhitespace(c)).toBeNull();
  });

  it('GIVEN un solo caracter THEN null', () => {
    const c = new FormControl('a');
    expect(notWhitespace(c)).toBeNull();
  });
});
