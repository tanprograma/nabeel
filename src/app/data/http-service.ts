import { DOCUMENT, inject, Injectable } from '@angular/core';
import { ApparelSnapshot } from './apparel.models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  origin = inject(DOCUMENT).location.origin;
  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async put<T>(url: string, body: any): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async patch<T>(url: string, body: any): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async head<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'HEAD',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // HEAD requests typically don't have a body, so we return an empty object
    return {} as T;
  }

  async options<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'OPTIONS',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async trace<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'TRACE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async connect<T>(url: string): Promise<T> {
    const response = await fetch(`${this.origin}${url}`, {
      method: 'CONNECT',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}
