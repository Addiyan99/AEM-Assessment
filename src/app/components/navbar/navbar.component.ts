import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../utils/services/auth.service';
import { SIGN_IN_ROUTE } from '../../utils/constants/route-constant';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate([SIGN_IN_ROUTE]);
  }
}
