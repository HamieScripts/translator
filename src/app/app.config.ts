import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { PolyFlowServiceModule } from 'poly-flow-service';
import { polyflowConfig } from '../../polyflow.config'; // Adjust path as needed

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(PolyFlowServiceModule.forRoot(polyflowConfig))
  ]
};