import { Component, input, OnDestroy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { League } from '../../models/league.model';
import { Subject } from 'rxjs';
import { LeaguesService } from '../../services/leagues.service';

@Component({
  selector: 'app-league-card',
  imports: [CardModule, CommonModule],
  templateUrl: './league-card.component.html',
  styleUrl: './league-card.component.scss'
})
export class LeagueCardComponent implements OnDestroy{
  league = input.required<League>();
  badgeUrl?: string;

  private destroy$ = new Subject<void>();

  constructor(private leaguesService: LeaguesService) {}

  onLeagueSelect(leagueId: string) {
    this.leaguesService.getLeagueBadge(leagueId).subscribe({
      next: (badgeUrl) => {
        this.badgeUrl = badgeUrl;
      },
      error: (error) => {
        console.error('Error loading badge:', error);
        this.badgeUrl = undefined;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
