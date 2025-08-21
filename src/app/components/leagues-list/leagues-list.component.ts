import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueCardComponent } from '../league-card/league-card.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { LeaguesService } from '../../services/leagues.service';
import { League } from '../../models/league.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { SportSelectComponent } from '../sport-select/sport-select.component';

@Component({
  selector: 'app-leagues-list',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MessageModule,
    LeagueCardComponent,
    InputTextModule,
    FormsModule,
    SportSelectComponent
  ],
  templateUrl: './leagues-list.component.html',
  styleUrl: './leagues-list.component.scss'
})
export class LeaguesListComponent implements OnInit, OnDestroy{
  leagues = signal<League[]>([]);
  isLoading = signal(true);
  error = signal<string | undefined>(undefined);
  leagueNameSearchStr = signal<string>('');
  selectedSport = signal<string | undefined>(undefined);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private leaguesService: LeaguesService) {
    // Only search after 0.5 after typing stopped; don't trigger a search if the string is the same
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.leagueNameSearchStr.set(searchValue);
      this.loadLeagues();
    });
  }

  ngOnInit(): void {
    this.loadLeagues();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  onSportSelect(sport: string | undefined) {
    this.selectedSport.set(sport);
    this.loadLeagues();
  }

  private loadLeagues() {
    this.isLoading.set(true);
    this.leaguesService.getAllLeagues(
      this.leagueNameSearchStr(),
      this.selectedSport()
    ).subscribe({
      next: (leagues) => {
        this.leagues.set(leagues);
        this.isLoading.set(false);
        this.error.set(undefined);
      },
      error: (error) => {
        console.error('Error loading leagues:', error);
        this.isLoading.set(false);
        this.error.set('Failed to load leagues. Please try again later.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }
}
