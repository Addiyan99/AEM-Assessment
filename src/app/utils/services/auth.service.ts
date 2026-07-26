import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
import { SIGN_IN_URL } from '../constants/api-constant';
import { PouchDbService } from './pouchdb.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly storageKey = 'aem_token';

    constructor(
        private http: HttpClient,
        private pouchDbService: PouchDbService
    ) { }

    login(username: string, password: string): Observable<string> {
        return this.http.post(SIGN_IN_URL, { username, password }, { responseType: 'text' as const }).pipe(
            switchMap(async (token) => {
                this.storeToken(token);
                await this.pouchDbService.saveLogin(username, password);
                return token;
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.storageKey);
        // Keep stored credentials in PouchDB for offline login
    }

    getToken(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    async validateStoredCredentials(username: string, password: string): Promise<boolean> {
        return this.pouchDbService.validateStoredCredentials(username, password);
    }

    async offlineLogin(username: string, password: string): Promise<boolean> {
        const isValid = await this.validateStoredCredentials(username, password);
        if (isValid) {
            // Generate a local offline token
            const offlineToken = `offline_${username}_${Date.now()}`;
            this.storeToken(offlineToken);
        }
        return isValid;
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
