import { Component, OnInit } from '@angular/core';
import { Game } from '../model/game';
import { Turn } from '../model/turn';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {


  startNewGameDivShown: boolean = true;
  userBudget: number = 0;
  currentGame: Game | null = null;
  betAmounts: number[] = [10, 20, 50];
  currentBetAmount: number | null = null;
  currentTurn: Turn | null = null;
  winningCombination: any = null;

  allWiningCombinations: any[] = [];

  constructor(private gameService: GameService) { }




  getWinningCombination(symbols: string[]){
  
    for(let winningCombination of this.allWiningCombinations) {
      let intersection = 0;

      // console.log('winning combination: ', winningCombination);
      for(let i=0; i<3; i++){
        if(symbols[i] == winningCombination.elementsInCombination[i]){
          intersection++;
        }
      }
      // for(let symbol of symbols){
      //   if(!winningCombination.elementsInCombination.includes(symbol)){
      //     intersection = false;
      //     break;
      //   }
      // }
      if(intersection == 3){
        return winningCombination;
      }

		}
    return null;
  }

  refreshCurrentGame(){
    let gameId = localStorage.getItem('gameId');
    if (gameId) {
      this.startNewGameDivShown = false;
      this.gameService.findById(gameId)
        .subscribe(
          game => {
            console.log('loading existing game: ', game);
            this.currentGame = game;
            this.currentGame.turns.reverse();
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  ngOnInit(): void {
    

    this.gameService.getWinningCombinations()
      .subscribe(
        winningCombinations => {
          this.allWiningCombinations = winningCombinations;
          console.log('winning combinations: ', this.allWiningCombinations);
        },
        err => {
          console.log(err);
        }
      );
      this.refreshCurrentGame();
  }

  startGame() {
    console.log('starting a new game');
    if(!this.userBudget){
      alert('Cannot start new game without budget set');
      return;
    }
    this.gameService.createGame(this.userBudget)
      .subscribe(
        game => {
          console.log('new game: ', game);
          this.currentGame = game;
          localStorage.setItem('gameId', this.currentGame.gameId);
          this.startNewGameDivShown = false;
        },
        err => {
          console.log('err: ', err);
        }
      );
  }

  takeTurn() {
    let turn: Turn = new Turn();
    turn.amountBet = this.currentBetAmount ? this.currentBetAmount : 0;
    turn.creationDate = new Date();

    console.log('taking turn');
    this.gameService.takeTurn(turn, this.currentGame?.gameId)
      .subscribe(
        savedTurnDto => {
          console.log('Turn: ', savedTurnDto);
          this.currentGame?.turns.push(savedTurnDto.turn);
          // this.currentGame?.turns.reverse();
          this.currentTurn = savedTurnDto.turn;
          this.winningCombination = savedTurnDto.winningCombination;

          this.refreshCurrentGame();
        },
        err => {
          console.log('err: ', err);
        }
      );
  }

}
