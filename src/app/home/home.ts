import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

  ngOnInit() {
    this.languages = [
      { name: 'English', code: 'en' },
      { name: 'French', code: 'fr' }
    ];
  }
}
