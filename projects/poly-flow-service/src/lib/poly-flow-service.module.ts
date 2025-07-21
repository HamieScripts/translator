import { NgModule, ModuleWithProviders } from '@angular/core';
import { PolyflowService } from './polyflow-service';
import { PolyflowConfig, POLYFLOW_CONFIG } from './polyflow-config';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class PolyFlowServiceModule {
  static forRoot(config: PolyflowConfig): ModuleWithProviders<PolyFlowServiceModule> {
    return {
      ngModule: PolyFlowServiceModule,
      providers: [
        PolyflowService,
        { provide: POLYFLOW_CONFIG, useValue: config }
      ]
    };
  }
}