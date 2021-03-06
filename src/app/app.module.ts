import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuemComponent } from './quem/quem.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PokeapiService } from './pokeapi.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgParticlesModule } from 'ng-particles';
@NgModule({
  declarations: [
    AppComponent,
    QuemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    NgParticlesModule,
    NgbModule,
    MatButtonModule
  ],
  providers: [PokeapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
