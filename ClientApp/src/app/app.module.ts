import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ParticipantsComponent } from './participants/participants.component';
import { CameraComponent } from './camera/camera.component';
import { SettingsComponent } from './settings/settings.component';
import { DeviceSelectComponent } from './settings/device-select.component';
import { ActivityIndicatorComponent } from './activity-indicator/activity-indicator.component';

import { VideoChatService } from './services/videochat.service';
import { DeviceService } from './services/device.service';
import { StorageService } from './services/storage.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RoomsComponent,
        ParticipantsComponent,
        CameraComponent,
        SettingsComponent,
        DeviceSelectComponent,
        ActivityIndicatorComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule
    ],
    providers: [DeviceService, VideoChatService, StorageService],
    bootstrap: [AppComponent]
})
export class AppModule { }
