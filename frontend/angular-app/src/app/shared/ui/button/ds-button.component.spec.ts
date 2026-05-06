import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { DsButtonComponent } from './ds-button.component';

@Component({
  standalone: true,
  imports: [DsButtonComponent],
  template: ` <ds-button>Guardar</ds-button> `,
})
class DsButtonHost {}

describe('DsButtonComponent', () => {
  let fixture: ComponentFixture<DsButtonComponent>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [DsButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DsButtonComponent);
  });

  it('GIVEN contenido proyectado THEN renderiza texto', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [DsButtonHost] }).compileComponents();
    const f = TestBed.createComponent(DsButtonHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Guardar');
  });

  it('GIVEN loading true THEN boton deshabilitado y aria-busy (edge)', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
    expect(btn.nativeElement.getAttribute('aria-busy')).toBe('true');
  });

  it('GIVEN disabled sin loading THEN aria-disabled Y disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
    expect(btn.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('GIVEN type submit THEN refleja en el boton (edge: formularios)', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.getAttribute('type')).toBe('submit');
  });
});
