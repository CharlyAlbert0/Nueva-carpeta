import { Routes } from '@angular/router';

import { calculatorComponent } from './calculator.component';

export const calculatorRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'pages/calculator',
        component: calculatorComponent
    }]
}
];
