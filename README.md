# Tournament Management System

## Project Overview

This project is a Tournament Management System that allows users to create and manage tournaments. It includes functionalities for managing players, games, rounds, sets, and elo history. The system is designed to provide flexibility for different types of tournaments and includes features for tournament creation, game scheduling, and score tracking.

## Features

- **Tournament Creation**: Create a new tournament with a list of players.
- **Game Creation**: Add games within a tournament.
- **Round Generation**: Automatically generate rounds for players in a tournament.
- **Set Management**: Track and manage the score of sets within each round.
- **Elo History**: Keep track of players' elo scores and update them based on match results.

## Technologies Used

- **Next.js**: For building the application.
- **Prisma**: For database interactions.
- **SQLite**: Used as the database for local development (can be swapped for any other DB).
- **Jest**: For testing (both unit and integration tests).
- **Supertest**: For making HTTP requests during testing.

## Project Setup

### Prerequisites

Before setting up the project, make sure you have the following installed:

- Node.js (version 16.x or higher)
- Prisma CLI
- SQLite or any other relational database

### Installation Steps

1. **Clone the repository**:

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up the database**:

    - If using SQLite (default setup), Prisma will automatically create the database on first migration.
    - If using another database, ensure your `.env` file is properly configured with the appropriate database connection URL.

4. **Run migrations**:

    ```bash
    npx prisma migrate dev --name init
    ```

5. **Start the development server**:

    ```bash
    npm run dev
    ```

### Running Tests

To run tests, make sure you have set up your test database correctly. The tests will automatically spin up a test database during execution.

- Run unit and integration tests:

    ```bash
    npm run test
    ```

- Run the tests with coverage:

    ```bash
    npm run test:coverage
    ```

## API Endpoints

### POST `/api/tournaments`

- **Description**: Create a new tournament.
- **Request Body**:

    ```json
    {
      "players": [{"database_id": "123", "name": "Player 1"}, {"database_id": "456", "name": "Player 2"}],
      "creator_player": "creator_id",
      "game_type": 3
    }
    ```

- **Response**:

    ```json
    {
      "tournament_id": "109"
    }
    ```

### POST `/api/games`

- **Description**: Create a new game for an existing tournament.
- **Request Body**:

    ```json
    {
      "tournament_id": "109",
      "players": [{"database_id": "123", "name": "Player 1"}, {"database_id": "456", "name": "Player 2"}],
      "creator_player": "creator_id",
      "game_type": 3
    }
    ```

- **Response**:

    ```json
    {
      "game_id": "200"
    }
    ```

### GET `/api/tournaments/{id}`

- **Description**: Get details of a specific tournament by ID.
- **Response**:

    ```json
    {
      "tournament_id": "109",
      "status": "active",
      "players": [{"database_id": "123", "name": "Player 1"}, {"database_id": "456", "name": "Player 2"}]
    }
    ```

## Schema

### Players

- **id**: Unique identifier for the player.
- **name**: Player's name.
- **elo**: Player's elo score.

### Tournaments

- **id**: Unique identifier for the tournament.
- **status**: Status of the tournament (e.g., active, completed, deleted).

### Games

- **id**: Unique identifier for the game.
- **tournament_id**: Foreign key linking the game to a tournament.
- **players**: List of players involved in the game.

### Rounds

- **id**: Unique identifier for the round.
- **game_id**: Foreign key linking the round to a game.

### Sets

- **id**: Unique identifier for the set.
- **round_id**: Foreign key linking the set to a round.
- **player_1_score**: Player 1's score.
- **player_2_score**: Player 2's score.

### Elo Histories

- **id**: Unique identifier for the elo history record.
- **player_id**: Player associated with the elo history record.
- **elo**: The player's elo score at that time.
- **round_id**: The round where the elo was updated.

## Conclusion

This system allows users to create and manage tournaments, track player performance, and ensure fair gameplay with elo rankings. The architecture is flexible and can be extended to support additional tournament features as needed.

