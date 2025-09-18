import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  private readonly USERNAME = environment.username;
  private readonly PASSWORD = environment.password;
  private readonly LOGIN_URL = `${environment.domainUrl}/login`;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async ensureAuthenticated(): Promise<void> {
    if (this.getToken()) return;

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.LOGIN_URL, {
          username: this.USERNAME,
          password: this.PASSWORD,
        })
      );
      this.saveToken(response.token);
    } catch (err) {
      console.error('Auto-login failed:', err);
    }
  }
}
