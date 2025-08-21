import { Component, EventEmitter, Output, signal } from '@angular/core';
import { LeaguesService } from '../../services/leagues.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sport-select',
  imports: [SelectModule, FormsModule, AsyncPipe],
  templateUrl: './sport-select.component.html',
  styleUrl: './sport-select.component.scss'
})
export class SportSelectComponent {
  @Output() sportSelected = new EventEmitter<string | undefined>();

  availableSports$: Observable<string[]>;
  selectedSport?: string;

  constructor(private leaguesService: LeaguesService) {
    this.availableSports$ = this.leaguesService.getAvailableSports();
  }

  onSportChange() {
    this.sportSelected.emit(this.selectedSport);
  }
}
