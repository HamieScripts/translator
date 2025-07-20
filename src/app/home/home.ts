import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SelectModule, FormsModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  languages: Language[] = [];
  selectedLanguage: Language | undefined;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.languages = [
      { name: 'English', code: 'en' },
      { name: 'French', code: 'fr' }
    ];

    // Set initial selected language based on current translation language
    this.selectedLanguage = this.languages.find(lang => lang.code === this.translate.currentLang);
  }

  onLanguageChange() {
    if (this.selectedLanguage) {
      this.translate.use(this.selectedLanguage.code);
    }
  }
}
