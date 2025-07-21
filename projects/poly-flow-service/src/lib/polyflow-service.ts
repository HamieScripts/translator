import { Injectable, Inject } from '@angular/core';
import { PolyflowConfig, POLYFLOW_CONFIG } from './polyflow-config';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolyflowService {
  private _currentLanguage!: BehaviorSubject<string>;
  readonly currentLanguage$!: Observable<string>;

  constructor(@Inject(POLYFLOW_CONFIG) private config: PolyflowConfig) {
    this._currentLanguage = new BehaviorSubject<string>(this.config.defaultLanguage);
    this.currentLanguage$ = this._currentLanguage.asObservable();

    if (!this.config.translationRootDir || !this.config.defaultLanguage || !this.config.targetLanguages) {
      console.error('PolyflowService: Invalid configuration provided. Please ensure translationRootDir, defaultLanguage, and targetLanguages are set.');
    }
  }

  getAvailableLanguages(): string[] {
    const languages = new Set<string>();
    languages.add(this.config.defaultLanguage);
    this.config.targetLanguages.forEach(lang => languages.add(lang));
    return Array.from(languages);
  }

  setCurrentLanguage(language: string): void {
    if (this.getAvailableLanguages().includes(language)) {
      this._currentLanguage.next(language);
    } else {
      console.warn(`PolyflowService: Language '${language}' is not supported.`);
    }
  }

  getCurrentLanguage(): string {
    return this._currentLanguage.getValue();
  }
}
