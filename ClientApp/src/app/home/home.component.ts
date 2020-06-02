import { Component, ViewChild, OnInit } from '@angular/core';
import { Room, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../services/videochat.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    @ViewChild('rooms', { static: false }) rooms: RoomsComponent;
    @ViewChild('settings', { static: false }) settings: SettingsComponent;
    @ViewChild('participants', { static: false }) participants: ParticipantsComponent;

    activeRoom: Room;

    private notificationHub: HubConnection;

    constructor(
        private readonly videoChatService: VideoChatService) { }

    async ngOnInit() {
        const builder =
            new HubConnectionBuilder()
                .configureLogging(LogLevel.Information)
                .withUrl(`${location.origin}/notificationHub`);

        this.notificationHub = builder.build();
        this.notificationHub.on('RoomsUpdated', async updated => {
            if (updated) {
                await this.rooms.updateRooms();
            }
        });
        await this.notificationHub.start();
    }

    async onSettingsChanged(deviceInfo?: MediaDeviceInfo) {
        this.settings.hidePreviewCamera();
        await this.settings.showPreviewCamera();
    }

    async onLeaveRoom(_: boolean) {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }

        this.participants.clear();
    }

    async onRoomChanged(roomName: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            const tracks = await this.settings.showPreviewCamera();

            this.activeRoom =
                await this.videoChatService
                          .joinOrCreateRoom(roomName, tracks);

            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

            this.notificationHub.send('RoomsUpdated', true);
        }
    }

    onParticipantsChanged(_: boolean) {
        this.videoChatService.nudge();
    }

    private registerRoomEvents() {
        this.activeRoom
            .on('participantConnected',
                (participant: RemoteParticipant) => this.participants.add(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => this.participants.remove(participant))
            .on('dominantSpeakerChanged',
                (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
    }
}