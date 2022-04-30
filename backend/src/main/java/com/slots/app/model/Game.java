package com.slots.app.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Game {
	@Id
	private String gameId;

	private Date creationDate = new Date();
//	private Map<String, String> userSettings = new HashMap<>();
	private List<Turn> turns = new ArrayList<>();
	
	private Double currentBudget;

	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public List<Turn> getTurns() {
		return turns;
	}
	public void setTurns(List<Turn> turns) {
		this.turns = turns;
	}

	public Double getCurrentBudget() {
		return currentBudget;
	}
	public void setCurrentBudget(Double currentBudget) {
		this.currentBudget = currentBudget;
	}
}
