import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { PolyflowService } from 'poly-flow-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, ButtonGroupModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'translator';
  isDarkMode: boolean = false;
  currentLanguage: string = '';
  availableLanguages: string[] = [];

  constructor(private polyflowService: PolyflowService) {
    // Initialize isDarkMode based on system preference or a stored value
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }

  ngOnInit(): void {
    this.currentLanguage = this.polyflowService.getCurrentLanguage();
    this.availableLanguages = this.polyflowService.getAvailableLanguages();

    this.polyflowService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      console.log('Language changed to:', lang);
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  setLanguage(lang: string): void {
    this.polyflowService.setCurrentLanguage(lang);
  }

  openGitHub() {
    window.open('https://github.com/your-github-repo', '_blank'); // Replace with your GitHub repo URL
  }
}
