import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CdkStepperModule
  ],
  exports: [
    PaginationModule,
    CdkStepperModule
  ]
})
export class SharedModule { }
