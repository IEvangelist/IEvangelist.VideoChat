import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

export type Devices = MediaDeviceInfo[];

@Injectable()
export class DeviceService {
    private deviceBroadcast = new ReplaySubject<Promise<Devices>>();

    constructor() {
        if (navigator && navigator.mediaDevices) {
            navigator.mediaDevices.ondevicechange = this.updateDeviceOptions;
        }

        this.deviceBroadcast.next(this.getDeviceOptions());
    }

    private async getDeviceOptions(): Promise<Devices> {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
            return options[kind] = mediaDevices.filter(device => device.kind === kind);
        }, [] as Devices);
        
        return devices;
    }

    onDevicesUpdated(): Observable<Promise<Devices>> {
        return this.deviceBroadcast.asObservable();
    }

    private updateDeviceOptions(_: Event) {
        this.deviceBroadcast.next(this.getDeviceOptions());
    }
}