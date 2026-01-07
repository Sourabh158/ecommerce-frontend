import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ✅ withInterceptors जोड़ा गया
import { authInterceptor } from './auth-interceptor'; // ✅ इंटरसेप्टर को इम्पोर्ट करें (पाथ चेक कर लें)

import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // ✅ HttpClient में इंटरसेप्टर रजिस्टर किया गया है
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    ),

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
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