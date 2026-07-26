import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';

interface StoredUser {
  _id?: string;
  username: string;
  password: string;
  lastLoggedIn: string;
}

interface DashboardData {
  _id?: string;
  chartDonut: Array<{ name: string; value: number }>;
  chartBar: Array<{ name: string; value: number }>;
  tableUsers: Array<{ firstName: string; lastName: string; username: string }>;
  savedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PouchDbService {
  private readonly dbName = 'aem-auth-db';
  private readonly userDocId = 'user';
  private readonly dashboardDocId = 'dashboard';

  private async getDatabase(): Promise<any> {
    const db = new PouchDB(this.dbName);
    return db;
  }

  async saveLogin(username: string, password: string): Promise<void> {
    const database = await this.getDatabase();

    try {
      const existing = await database.get(this.userDocId);
      await database.put({
        ...existing,
        username,
        password,
        lastLoggedIn: new Date().toISOString()
      });
    } catch (error: any) {
      if (error.status === 404) {
        await database.put({
          _id: this.userDocId,
          username,
          password,
          lastLoggedIn: new Date().toISOString()
        });
      } else {
        throw error;
      }
    }
  }

  async validateStoredCredentials(username: string, password: string): Promise<boolean> {
    const database = await this.getDatabase();

    try {
      const doc = await database.get(this.userDocId);
      return (doc as StoredUser).username === username && (doc as StoredUser).password === password;
    } catch {
      return false;
    }
  }

  async saveDashboardData(data: DashboardData): Promise<void> {
    const database = await this.getDatabase();

    try {
      const existing = await database.get(this.dashboardDocId);
      await database.put({
        ...existing,
        ...data,
        savedAt: new Date().toISOString()
      });
    } catch (error: any) {
      if (error.status === 404) {
        await database.put({
          _id: this.dashboardDocId,
          ...data,
          savedAt: new Date().toISOString()
        });
      } else {
        throw error;
      }
    }
  }

  async getDashboardData(): Promise<DashboardData | null> {
    const database = await this.getDatabase();

    try {
      const doc = await database.get(this.dashboardDocId);
      return doc as DashboardData;
    } catch {
      return null;
    }
  }

  async clear(): Promise<void> {
    const database = await this.getDatabase();

    try {
      const doc = await database.get(this.userDocId);
      await database.remove(doc);
    } catch {
      // ignore if there is no stored user yet
    }
  }
}

