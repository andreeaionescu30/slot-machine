import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Turn } from '../model/turn';
import { TurnDto } from '../model/turn-dto';
import { Game } from '../model/game';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) { }

  // http://localhost:9000/rest/game/create
  // http://localhost:9000/rest/game/add-turn/6252f7be87e3332cbbd1e46d

  getWinningCombinations(): Observable<any[]>{
    return this.http.get<any[]>(`${environment.serverPath}/game/winning-combinations`,);
  }

  createGame(userBudget: number): Observable<Game> {
    const game = {
      currentBudget: userBudget
    };
    return this.http.post<Game>(`${environment.serverPath}/game/create`, game);
  }

  findById(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${environment.serverPath}/game/find-by-id/${gameId}`,);
  }

  takeTurn(turn: Turn, gameId?: string): Observable<TurnDto>{
    return this.http.post<TurnDto>(`${environment.serverPath}/game/add-turn/${gameId}`, turn);

  }

}
