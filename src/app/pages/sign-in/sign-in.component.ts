import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../utils/services/auth.service';
import { DASHBOARD_ROUTE } from '../../utils/constants/route-constant';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  form: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const username = this.form.value.email;
    const password = this.form.value.password;

    try {
      await this.authService.login(username, password).toPromise();
      this.router.navigate([DASHBOARD_ROUTE]);
    } catch (error) {
      const offlineLoginSuccess = await this.authService.offlineLogin(username, password);
      
      if (offlineLoginSuccess) {
        this.router.navigate([DASHBOARD_ROUTE]);
        return;
      }

      this.errorMessage = 'Authentication failed. Please check your credentials.';
      this.isSubmitting = false;
    }
  }
}
