import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = ''; // Title input for the header
  showBackButton: boolean = false;

  excludedRoutes: string[] = ['/dashboard', '/login', '/activity', '/organization'];

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.checkRoute(this.router.url); // Initial check

    // Listen for route changes
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkRoute(this.router.url);
    });
  }

  get isDashboardRoute(): boolean {
    return this.router.url === '/dashboard';
  }

  checkRoute(url: string) {
    this.showBackButton = !this.excludedRoutes.includes(url);
  }

  goBack(): void {
    this.location.back()
  }

  onMenuClick() {
    console.log('Menu button clicked');
    // Implement the functionality you want for the menu button here
  }
}
