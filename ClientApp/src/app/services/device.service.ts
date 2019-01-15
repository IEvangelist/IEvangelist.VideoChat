import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

export type Devices = MediaDeviceInfo[];

@Injectable()
export class DeviceService {
    $devicesUpdated: Observable<Promise<Devices>>;

    private deviceBroadcast = new ReplaySubject<Promise<Devices>>();

    constructor() {
        if (navigator && navigator.mediaDevices) {
            navigator.mediaDevices.ondevicechange = (_: Event) => {
                this.deviceBroadcast.next(this.getDeviceOptions());
            }
        }

        this.$devicesUpdated = this.deviceBroadcast.asObservable();
        this.deviceBroadcast.next(this.getDeviceOptions());
    }

    private async getDeviceOptions(): Promise<Devices> {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
            return options[kind] = mediaDevices.filter(device => device.kind === kind);
        }, [] as Devices);
        
        return devices;
    }
}