import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, ButtonGroupModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'translator';
  isDarkMode: boolean = false;

  constructor(private translate: TranslateService) {
    // Initialize isDarkMode based on system preference or a stored value
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  openGitHub() {
    window.open('https://github.com/your-github-repo', '_blank'); // Replace with your GitHub repo URL
  }
}