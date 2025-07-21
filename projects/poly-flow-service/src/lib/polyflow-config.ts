export interface PolyflowConfig {
  translationRootDir: string;
  defaultLanguage: string;
  targetLanguages: string[];
}

import { InjectionToken } from '@angular/core';

export const POLYFLOW_CONFIG = new InjectionToken<PolyflowConfig>('polyflow.config');
