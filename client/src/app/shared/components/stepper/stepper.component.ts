import { Component, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import { CdkStepper, CdkStep } from '@angular/cdk/stepper';
import { Directionality } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }]
})
export class StepperComponent extends CdkStepper {
  constructor(
    private cdr: ChangeDetectorRef,
    private dir: Directionality,
    private elRef: ElementRef<HTMLElement>
  ) {
    super(dir, cdr, elRef);
  }

  @Input() linearModeSelected: boolean = true;

  ngOnInit() {
    this.linear = this.linearModeSelected;
  }

  onClick(index: number) {
    this.selectedIndex = index;
  }

  // Override next() method to ensure proper navigation
  override next(): void {
    if (this.selectedIndex < this.steps.length - 1) {
      this.selectedIndex = this.selectedIndex + 1;
      this._stateChanged();
    }
  }

  // Override previous() method to ensure proper navigation
  override previous(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex = this.selectedIndex - 1;
      this._stateChanged();
    }
  }

  // Override reset() method
  override reset(): void {
    this.selectedIndex = 0;
    this._stateChanged();
  }

  // Override _stateChanged method
  override _stateChanged(): void {
    super._stateChanged();
  }
}
