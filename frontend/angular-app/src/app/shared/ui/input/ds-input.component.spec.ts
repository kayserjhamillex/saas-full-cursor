import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { DsInputComponent } from './ds-input.component';

@Component({
  standalone: true,
  imports: [DsInputComponent, ReactiveFormsModule],
  template: ` <ds-input [formControl]="control" label="Email" type="email" [error]="err" /> `,
})
class CvaHost {
  control = new FormControl('', { validators: [Validators.required, Validators.email] });
  err: string | null = null;
}

describe('DsInputComponent (CVA + formularios)', () => {
  let fixture: ComponentFixture<CvaHost>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [CvaHost] }).compileComponents();
    fixture = TestBed.createComponent(CvaHost);
  });

  it('GIVEN FormControl con valor THEN refleja en el input (caso feliz)', () => {
    fixture.componentInstance.control.setValue('a@b.com');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect((input.nativeElement as HTMLInputElement).value).toBe('a@b.com');
  });

  it('GIVEN error prop y blur THEN showError (edge: solo touched + error)', () => {
    const host = fixture.componentInstance;
    host.err = 'Demasiado corto';
    fixture.detectChanges();
    const inner = fixture.debugElement.query(By.directive(DsInputComponent))
      .componentInstance as DsInputComponent;
    expect(inner.touched).toBe(false);
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(inner.touched).toBe(true);
    expect(inner.showError).toBe(true);
    const err = fixture.debugElement.query(By.css('.ds-in__error'));
    expect(err?.nativeElement.textContent).toContain('Demasiado corto');
  });

  it('GIVEN error sin touch THEN no showError (edge)', () => {
    const host = fixture.componentInstance;
    host.err = 'Obligatorio';
    fixture.detectChanges();
    const inner = fixture.debugElement.query(By.directive(DsInputComponent))
      .componentInstance as DsInputComponent;
    expect(inner.showError).toBe(false);
  });

  it('GIVEN input event THEN actualiza FormControl', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'nuevo@e.com';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.control.value).toBe('nuevo@e.com');
  });

  it('GIVEN setDisabledState THEN input deshabilitado (edge)', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
