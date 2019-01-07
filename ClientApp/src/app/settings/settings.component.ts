import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-settings',
    styleUrls: ['./settings.component.css'],
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
    private devices: MediaDeviceInfo[] = [];
    private subscription: Subscription;

    get hasAudioInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
    }
    get hasAudioOutputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
    }
    get hasVideoInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
    }

    @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

    constructor(
        private readonly deviceService: DeviceService) { }

    ngOnInit() {
        this.subscription =
            this.deviceService
                .onDevicesUpdated()
                .subscribe(async deviceListPromise => this.devices = await deviceListPromise);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        this.settingsChanged.emit(deviceInfo);
    }
}