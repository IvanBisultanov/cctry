import { InjectionToken } from '@angular/core';

export type Environment = {
  production: boolean;
  baseURL: string;
};

export const ENVIRONMENT: InjectionToken<Environment> =
  new InjectionToken<Environment>('environment');
