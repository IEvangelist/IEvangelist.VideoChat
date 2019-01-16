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

    private async isGrantedMediaPermissions() {
        if (navigator && navigator['permissions']) {
            const result = await navigator['permissions'].query({ name: 'camera' });
            if (result) {
                if (result.state === 'granted') {
                    return true;
                } else {
                    const isGranted = await new Promise<boolean>(resolve => {
                        result.onchange = (e: Event) => {
                            const granted = e.target['state'] === 'granted';
                            if (granted) {
                                resolve(true);
                            }
                        }
                    });

                    return isGranted;
                }
            }
        }

        return false;
    }

    private async getDeviceOptions(): Promise<Devices> {
        const isGranted = await this.isGrantedMediaPermissions();
        if (navigator && navigator.mediaDevices && isGranted) {
            let devices = await this.tryGetDevices();
            if (devices.every(d => !d.label)) {
                devices = await this.tryGetDevices();
            }
            return devices;
        }

        return null;
    }

    private async tryGetDevices() {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
            return options[kind] = mediaDevices.filter(device => device.kind === kind);
        }, [] as Devices);

        return devices;
    }
}