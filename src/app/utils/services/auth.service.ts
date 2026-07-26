import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SIGN_IN_URL } from '../constants/api-constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly storageKey = 'aem_token';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<string> {
        return this.http.post(SIGN_IN_URL, { username, password }, { responseType: 'text' as const }).pipe(
            tap((token) => this.storeToken(token))
        );
    }

    logout(): void {
        localStorage.removeItem(this.storageKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private storeToken(token: string): void {
        const rawToken = this.normalizeToken(token);
        localStorage.setItem(this.storageKey, rawToken);
    }

    private normalizeToken(token: string): string {
        if (!token) {
            return '';
        }

        let trimmed = token.trim();

        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            trimmed = trimmed.slice(1, -1).trim();
        }

        if (trimmed.toLowerCase().startsWith('bearer ')) {
            return trimmed.substring(7).trim();
        }

        return trimmed;
    }
}
