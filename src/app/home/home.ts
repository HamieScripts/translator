import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';

interface Language {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SelectModule, FormsModule, TranslateModule, MarkdownComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  public usageMarkdown: string =
`\`\`\`yaml
- name: Run Translator
  uses: HamieScripts/translator@main
  with:
    src: example-data/en.json
    from: en
    to: fr,es,de
\`\`\``;
  languages: Language[] = [];
  selectedLanguage: Language | undefined;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.languages = [
      { name: 'English', code: 'en', flag: '🇺🇸' },
      { name: 'French', code: 'fr', flag: '🇫🇷' }
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