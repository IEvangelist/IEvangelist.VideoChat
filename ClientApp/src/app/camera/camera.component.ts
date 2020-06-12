import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { createLocalVideoTrack, LocalVideoTrack } from 'twilio-video';
import { StorageService } from '../services/storage.service';

@Component({
    selector: 'app-camera',
    styleUrls: ['./camera.component.css'],
    templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit {
    @ViewChild('preview') previewElement: ElementRef;

    isInitializing: boolean = true;
    videoTrack: LocalVideoTrack = null;

    constructor(
        private readonly storageService: StorageService,
        private readonly renderer: Renderer2) { }

    async ngAfterViewInit() {
        if (this.previewElement && this.previewElement.nativeElement) {
            const selectedVideoInput = this.storageService.get('videoInputId');
            await this.initializeDevice(selectedVideoInput);
        }
    }

    async initializePreview(deviceId: string) {
        await this.initializeDevice(deviceId);
    }

    finalizePreview() {
        try {
            if (this.videoTrack) {
                this.videoTrack.detach().forEach(element => element.remove());
            }
            this.videoTrack = null;
        } catch (e) {
            console.error(e);
        }
    }

    private async initializeDevice(deviceId?: string) {
        try {
            this.isInitializing = true;

            this.finalizePreview();

            this.videoTrack = deviceId
                ? await createLocalVideoTrack({ deviceId })
                : await createLocalVideoTrack();

            const videoElement = this.videoTrack.attach();
            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        } finally {
            this.isInitializing = false;
        }
    }
}