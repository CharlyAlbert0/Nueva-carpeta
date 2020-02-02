
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { calculatorComponent } from './calculator.component';
import { calculatorRoutes } from './calculator.routing';

@NgModule({
    imports: [
        RouterModule.forChild(calculatorRoutes),
        CommonModule,
        FormsModule
    ],
    providers: [CurrencyPipe],
    declarations: [calculatorComponent]
})

export class calculatorModule {}
