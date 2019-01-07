import { Component, ViewChild } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../services/videochat.service';

@Component({
    selector: 'app-layout',
    styleUrls: ['./layout.component.css'],
    templateUrl: './layout.component.html',
})
export class LayoutComponent  {
    @ViewChild('rooms') rooms: RoomsComponent;
    @ViewChild('camera') camera: CameraComponent;
    @ViewChild('settings') settings: SettingsComponent;
    @ViewChild('participants') participants: ParticipantsComponent;

    private activeRoom: Room;

    constructor(
        private readonly videoChatService: VideoChatService) { }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
    }

    async onRoomChanged(roomName: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.activeRoom =
                await this.videoChatService
                          .joinOrCreateRoom(roomName, this.camera.tracks);

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
        }
    }

    private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
        return !!track
            && (track as LocalAudioTrack).detach !== undefined
            || (track as LocalVideoTrack).detach !== undefined;
    }
}