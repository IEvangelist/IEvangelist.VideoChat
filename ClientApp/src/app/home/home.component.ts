import { Component, ViewChild, OnInit } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../services/videochat.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    @ViewChild('rooms') rooms: RoomsComponent;
    @ViewChild('camera') camera: CameraComponent;
    @ViewChild('settings') settings: SettingsComponent;
    @ViewChild('participants') participants: ParticipantsComponent;

    activeRoom: Room;

    private notificationHub: HubConnection;

    constructor(
        private readonly videoChatService: VideoChatService) { }

    ngOnInit() {
        const builder =
            new HubConnectionBuilder()
                .configureLogging(LogLevel.Information)
                .withUrl(`${location.origin}/notificationHub`);

        this.notificationHub = builder.build();
        this.notificationHub.on('OnRoomsUpdated', async updated => {
            if (updated) {
                await this.rooms.updateRooms();
            }
        });
        this.notificationHub.start();
    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
    }

    async onLeaveRoom() {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }

        this.camera.finalizePreview();
        const videoDevice = this.settings.hidePreviewCamera();
        this.camera.initializePreview(videoDevice);

        this.participants.clear();
    }

    async onRoomChanged(roomName: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
            const tracks = await this.settings.showPreviewCamera();

            this.activeRoom =
                await this.videoChatService
                          .joinOrCreateRoom(roomName, tracks);

            this.participants.initialize(this.activeRoom.participants);

            this.activeRoom
                .on('disconnected',
                    (room: Room) => {
                        room.localParticipant.tracks.forEach(publication => {
                            if (this.isDetachable(publication.track)) {
                                const attachedElements = publication.track.detach();
                                attachedElements.forEach(element => element.remove());
                            }
                        });
                    })
                .on('participantConnected',
                    (participant: RemoteParticipant) => this.participants.add(participant))
                .on('participantDisconnected',
                    (participant: RemoteParticipant) => this.participants.remove(participant))
                .on('dominantSpeakerChanged',
                    (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));

            this.notificationHub.send('RoomsUpdated', true);
        }
    }

    onParticipantsChanged(participantCount: number) {
        this.rooms.updateParticipantCount(this.activeRoom.name, participantCount);
    }

    private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
        return !!track
            && ((track as LocalAudioTrack).detach !== undefined
            || (track as LocalVideoTrack).detach !== undefined);
    }
}