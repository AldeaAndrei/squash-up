# Squash Tournament Management System

## Project Overview

This project is a Tournament Management System that allows users to create and manage squash tournaments. It includes functionalities for managing players, games, and ELO ranking. The system is designed to provide flexibility for different types of tournaments with multiple games per tournament and multiple game modes (1 set per round or best 2 out of 3).

## How to use

- Login or create an account using the signup page.
- After login you will be redirected to the tournament creation page, where you need to select the players for the tournament and press 'Start'.
  The number of rounds can be selected as well (1 round or 3, where 2 best ot of 3 win the round).
- The system will generate a 'Game' (a subdivision of a tournament) with all the matches, every player will compete against every other player.
- The score must be written in the generated form, after 2 seconds of inactivity the score will be automaticaly saved in the DB.
- At the end of the game, when all the rounds are played, a new game can be generated from the sidebar.
  The new game is part of the current tournament and contains the same players with new rounds to be played, but generated in a diffrent order.
- At the end of the tourament, the calculate elo button can be pressed and the leaderboard will be updated.
- From the sidebar, a user can navigate to the:
  -- Leaderboard
  -- New tournament page
  -- Profile
  
## Features

- **Tournament Creation**: Create a new tournament with a list of players.
- **Game Creation**: Add games within a tournament.
- **Round Generation**: Automatically generate rounds for players in a tournament.
- **Set Management**: Track and manage the score of sets within each round.
- **Elo History**: Keep track of players' ELO scores and update them based on match results.

## Technologies Used

- **Next.js**: For building the application.
- **Prisma**: For database interactions.
- **PostgreSQL**: Used as the database for local development (can be swapped for any other DB).

## Project Setup

### Prerequisites

Before setting up the project, make sure you have the following installed:

- Node.js (version 16.x or higher)
- Prisma CLI

The `.env` file must include the following:

```env
DATABASE_URL=<your_database_url>
DIRECT_URL=<your_direct_url>
SECRET=<your_secret_key>
```

- **DATABASE_URL**: This is the connection string to your database (e.g., Supabase, PostgreSQL).
- **DIRECT_URL**: A direct connection URL for the database, typically provided by the database host (e.g., Supabase).
- **SECRET**: A secret key used to encrypt/decrypt sensitive data (such as passwords).

### Notes on Database Configuration

- **DATABASE_URL** and **DIRECT_URL** can be found in the documentation: [Supabase Documentation](https://supabase.com/docs/guides/database/prisma).
- In some cases, to avoid errors, you may need to add `?pgbouncer=true` at the end of the URL.

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AldeaAndrei/squash-up.git
   cd squash-up
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:

   - Ensure your `.env` file is properly configured with the appropriate database connection URL.
   - Assuming the Supabase URLs are provided correctly, run:

   ```bash
   npx prisma db pull
   ```

   This will generate the Prisma schema.

   - Then, run:

   ```bash
   npx prisma generate
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

## Schema

### Players

- **id**: Unique identifier for the player.
- **name**: Player's name.
- **username**: Player's unique username.
- **elo**: Player's Elo score.
- **password**: Player's password (hashed).

### Tournaments

- **id**: Unique identifier for the tournament.
- **deleted**: Status of the tournament (whether it has been deleted or not).

### Games

- **id**: Unique identifier for the game.
- **tournament_id**: Foreign key linking the game to a tournament.
- **created_by**: The player who created the game.
- **played_by**: List of players involved in the game.

### Rounds

- **id**: Unique identifier for the round.
- **game_id**: Foreign key linking the round to a game.
- **player_1_id**: Unique identifier for player 1.
- **player_2_id**: Unique identifier for player 2.
- **player_1_name**: Player 1's name (if a player is not registered, the name will be used as an identifier).
- **player_2_name**: Player 2's name (if a player is not registered, the name will be used as an identifier).

### Sets

- **id**: Unique identifier for the set.
- **round_id**: Foreign key linking the set to a round.
- **player_1_score**: Player 1's score.
- **player_2_score**: Player 2's score.

### Elo Histories

- **id**: Unique identifier for the Elo history record.
- **player_id**: Player associated with the elo history record.
- **elo**: The player's elo score at that time.
- **round_id**: The round where the elo was updated.
