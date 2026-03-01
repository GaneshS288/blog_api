import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSignalFormsConfig({classes: NG_STATUS_CLASSES}),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
