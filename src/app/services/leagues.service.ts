import { Injectable } from '@angular/core';
import { League } from '../models/league.model';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {
  private leaguesCache: League[] | null = null;
  private badgesCache = new Map<string, string>();
  private sportsCache$ = new BehaviorSubject<Set<string>>(new Set());
  private apiURL: string = 'https://www.thesportsdb.com/api/v1/json/3/';

  constructor(private http: HttpClient) { }

  getAllLeagues(searchStr?: string, sportType?: string): Observable<League[]> {
    if (this.leaguesCache) {
      return of(this.filterLeagues(this.leaguesCache, searchStr, sportType));
    }

    return this.http.get<{ leagues: League[] }>(
      `${this.apiURL}all_leagues.php`
    ).pipe(
      map(res => res.leagues),
      tap(leagues => {
        this.leaguesCache = leagues;
        // Update sports cache
        const sports = new Set<string>();
        leagues.forEach(league => {
          if (league.strSport) {
            sports.add(league.strSport);
          }
        });
        this.sportsCache$.next(sports);
      }),
      map(leagues => this.filterLeagues(leagues, searchStr, sportType))
    );
  }

  getAvailableSports(): Observable<string[]> {
    return this.sportsCache$.pipe(
      map(sports => Array.from(sports).sort())
    );
  }

  private filterLeagues(leagues: League[], searchStr?: string, sportType?: string): League[] {
    let filteredLeagues = leagues;

    // Apply name search filter
    if (searchStr) {
      const searchLower = searchStr.toLowerCase();
      filteredLeagues = filteredLeagues.filter(league =>
        league.strLeague.toLowerCase().includes(searchLower)
      );
    }

    // Apply sport filter
    if (sportType) {
      filteredLeagues = filteredLeagues.filter(league =>
        league.strSport === sportType
      );
    }

    return filteredLeagues;
  }

  getLeagueBadge(id: string): Observable<string> {
    if (this.badgesCache.has(id)) {
      return of(this.badgesCache.get(id)!);
    }
    return this.http.get<{ seasons: Season[] }>(
      `${this.apiURL}search_all_seasons.php?badge=1&id=${id}`
    ).pipe(
      map(res => res.seasons[0].strBadge),
      tap(badge => this.badgesCache.set(id, badge))
    );
  }
}
