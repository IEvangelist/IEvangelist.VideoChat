import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-activity-indicator',
    templateUrl: './activity-indicator.component.html',
})
export class ActivityIndicatorComponent {
    @Input() message: string = 'Loading... Please wait.';
}