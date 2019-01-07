import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NamedRoom, VideoChatService } from '../services/videochat.service';


@Component({
    selector: 'app-rooms',
    styleUrls: ['./rooms.component.css'],
    templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit, OnDestroy {
    @Output() roomChanged = new EventEmitter<string>();

    private subscription: Subscription; 

    roomName: string;
    rooms: NamedRoom[];

    constructor(
        private readonly videoChatService: VideoChatService) { }

    async ngOnInit() {
        await this.getAndAssignRooms();
        this.subscription =
            this.videoChatService
                .$roomsUpdated
                .do(async _ => await this.getAndAssignRooms())
                .subscribe();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onAddRoom(roomName: string) {
        this.roomName = null;
        this.roomChanged.emit(roomName);
    }

    onJoinRoom(roomName: string) {
        this.roomChanged.emit(roomName);
    }

    private async getAndAssignRooms() {
        this.rooms = (await this.videoChatService.getAllRooms()) as NamedRoom[];
    }
}