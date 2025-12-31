import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Agar file ka naam alag hai to check karein
import { provideHttpClient } from '@angular/common/http';

// 👇 1. Library Import
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    // 👇 2. Google Auth Provider Setup
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              // 👇 YAHAN APNI CLIENT ID DALEIN (Galti mat karna)
              '725073792394-okigspuuloi04ls0t7embu4ta0ktdfpg.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};