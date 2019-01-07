import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
    Participant,
    RemoteTrack,
    RemoteAudioTrack,
    RemoteVideoTrack,
    RemoteParticipant
} from 'twilio-video';

@Component({
    selector: 'app-participants',
    styleUrls: ['./participants.component.css'],
    templateUrl: './participants.component.html',
})
export class ParticipantsComponent implements AfterViewInit {
    private participants: Map<Participant.SID, RemoteParticipant>;
    private dominantSpeaker: RemoteParticipant;

    private list: HTMLDivElement;
    @ViewChild('list') listRef: ElementRef;

    ngAfterViewInit() {
        if (this.listRef && this.listRef.nativeElement) {
            this.list = this.listRef.nativeElement as HTMLDivElement;
        }
    }

    initialize(participants: Map<Participant.SID, RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => {
                participant.tracks.forEach(pub => {
                    if (pub.isSubscribed) {
                        const track = pub.track;
                        if (this.isAttachable(track)) {
                            this.list.appendChild(track.attach());
                        }
                    }
                });
            });
        }
    }

    add(participant: RemoteParticipant) {
        if (this.participants && !this.participants.has(participant.sid)) {
            this.participants.set(participant.sid, participant);
        }
    }

    remove(participant: RemoteParticipant) {
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }

    loudest(participant: RemoteParticipant) {
        this.dominantSpeaker = participant;
    }

    private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track
            && (track as RemoteAudioTrack).attach !== undefined
            || (track as RemoteVideoTrack).attach !== undefined;
    }

    private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track
            && (track as RemoteAudioTrack).detach !== undefined
            || (track as RemoteVideoTrack).detach !== undefined;
    }
}