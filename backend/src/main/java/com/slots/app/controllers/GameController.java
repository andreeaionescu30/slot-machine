package com.slots.app.controllers;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.slots.app.dto.TurnDto;
import com.slots.app.model.Game;
import com.slots.app.model.Turn;
import com.slots.app.model.WinningCombination;
import com.slots.app.repo.GameRepository;
import com.slots.app.service.SlotService;

@RestController
@RequestMapping(value = "/rest/game")
public class GameController {
	private final Logger Logger = LoggerFactory.getLogger(getClass());

	private final GameRepository gameRepository;
	private final SlotService slotService;

	public GameController(GameRepository gameRepository, SlotService slotService) {
		this.gameRepository = gameRepository;
		this.slotService = slotService;
	}

	@RequestMapping(value = "/all", method = RequestMethod.GET)
	public List<Game> getAllGames() {
		Logger.info("Getting all users...");
		return gameRepository.findAll();
	}

	@RequestMapping(value = "/find-by-id/{gameId}", method = RequestMethod.GET)
	public Game findGame(@PathVariable("gameId") String gameId) {
		return gameRepository.findById(gameId).orElse(null);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	public Game addNewGame(@RequestBody Game game) {
		Logger.info("Saving game...");
		return gameRepository.save(game);
	}
	
	@RequestMapping(value = "/winning-combinations", method = RequestMethod.GET)
	public List<WinningCombination> getWinningCombinations(){
		return this.slotService.getWinningCombinations();
	}

	@RequestMapping(value = "/add-turn/{gameId}", method = RequestMethod.POST)
	public TurnDto addGameTurn(@PathVariable("gameId") String gameId, @RequestBody Turn turn) {
		Game game = gameRepository.findById(gameId).orElse(null);
		if (game == null)
			return null;
		
		String symbol1 = slotService.generateRandomSymbol();
		String symbol2 = slotService.generateRandomSymbol();
		String symbol3 = slotService.generateRandomSymbol();
		
		turn.setSymbol1(symbol1);
		turn.setSymbol2(symbol2);
		turn.setSymbol3(symbol3);
		game.getTurns().add(turn);
		
		List<String> symbolsAll = Stream.of(symbol1, symbol2, symbol3).collect(Collectors.toList());
		
		List<WinningCombination> winningCombinations = slotService.getWinningCombinations();
		System.out.println("WINNING COMBINATIONS: " + winningCombinations);
		WinningCombination winningCombinationWhichApplies = null;
		for (WinningCombination winningCombination : winningCombinations) {
			if (winningCombination.applies(symbolsAll)) {
				winningCombinationWhichApplies = winningCombination;
				break;
			}
		}
		
		System.out.println("WINNING COMBINATION WHICH APPLIES: " + winningCombinationWhichApplies);
		
		if (winningCombinationWhichApplies != null) {
			// player won, increase buget by amount bet * ratio
			game.setCurrentBudget(game.getCurrentBudget() + turn.getAmountBet() * winningCombinationWhichApplies.getRatio());
		}
		else {
			// player lost
			game.setCurrentBudget(game.getCurrentBudget() - turn.getAmountBet());
		}
		
		gameRepository.save(game);

		TurnDto turnDto = new TurnDto();
		turnDto.setTurn(turn);
		turnDto.setWinningCombination(winningCombinationWhichApplies);
		return turnDto;
	}
}
