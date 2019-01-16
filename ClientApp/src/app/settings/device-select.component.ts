import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StorageService, StorageKey } from '../services/storage.service';

class IdGenerator {
    protected static id: number = 0;
    static getNext() {
        return ++ IdGenerator.id;
    }
}

@Component({
    selector: 'app-device-select',
    templateUrl: './device-select.component.html'
})
export class DeviceSelectComponent {
    private localDevices: MediaDeviceInfo[] = [];

    id: string;
    selectedId: string;

    get devices(): MediaDeviceInfo[] {
        return this.localDevices;
    }

    @Input() label: string;
    @Input() kind: MediaDeviceKind;
    @Input() key: StorageKey;
    @Input() set devices(devices: MediaDeviceInfo[]) {
        this.selectedId = this.getOrAdd(this.key, this.localDevices = devices);
    }

    @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

    constructor(
        private readonly storageService: StorageService) {
        this.id = `device-select-${IdGenerator.getNext()}`;
    }

    onSettingsChanged(deviceId: string) {
        this.setAndEmitSelections(this.key, this.selectedId = deviceId);
    }

    private getOrAdd(key: StorageKey, devices: MediaDeviceInfo[]) {
        const existingId = this.storageService.get(key);
        if (devices && devices.length > 0) {
            const defaultDevice = devices.find(d => d.deviceId === existingId) || devices[0];
            this.storageService.set(key, defaultDevice.deviceId);
            return defaultDevice.deviceId;
        }

        return null;
    }

    private setAndEmitSelections(key: StorageKey, deviceId: string) {
        this.storageService.set(key, deviceId);
        this.settingsChanged.emit(this.devices.find(d => d.deviceId === deviceId));
    }
}