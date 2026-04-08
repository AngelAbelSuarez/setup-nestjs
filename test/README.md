# Integration Tests

This directory contains integration tests for the user endpoints. These tests use a real SQL test database (a separate database from the development database) and mock HTTP responses from the Dragon Ball Z API.

## Setup

The integration tests require:

1. A PostgreSQL database server
2. The ability to create a database called `usersdb_test` (or modify `.env.test` to use a different database name)

## Configuration

The test database is configured in `.env.test`. You can modify these settings to match your environment:

```bash
# Database Configuration for Testing
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=usersdb_test
DATABASE_SYNC=true

# API Configuration
DRAGONBALL_API_URL='https://dragonball-api.com/api/characters'
```

## Running Tests

```bash
npm run test:e2e
```

## Test Structure

The integration tests are organized by endpoint:

- `POST /users`: Tests for creating a new user
- `GET /users`: Tests for retrieving all users
- `GET /users/:id`: Tests for retrieving a user with their Dragon Ball Z details
- `PATCH /users/:id`: Tests for updating a user with their Dragon Ball Z details
- `DELETE /users/:id`: Tests for deleting a user

Each test verifies both the HTTP response and that the database was updated correctly.

## Mocking

The tests use Jest's `spyOn` to selectively mock HTTP requests to the Dragon Ball Z API endpoints. This approach:

1. Uses a simple string matching to identify Dragon Ball Z endpoint paths (`/characters/{id}`)
2. Works with any base URL as long as it contains the matching endpoint path
3. Intercepts requests regardless of domain (e.g., both `localhost:3000/characters/1` and `dragonball-api.com/api/characters/1`)
4. Allows verification of the exact API calls made during the tests

The mock data includes information for:

```typescript
export const mockDragonBallZData = [
  {
    id: 1,
    name: 'Goku',
    ki: '1000',
    maxKi: '1000',
    race: 'Saiyan',
    gender: 'Male',
    description: 'The strongest being in the universe',
    image: 'https://example.com/goku.jpg',
    affiliation: 'Saiyan',
  },
  {
    id: 2,
    name: 'Vegeta',
    ki: '1000',
    maxKi: '1000',
    race: 'Saiyan',
    gender: 'Male',
    description: 'The strongest being in the universe',
    image: 'https://example.com/vegeta.jpg',
    affiliation: 'Saiyan',
  },
];
```

Example of the simple path matching implementation:

```typescript
// Helper function to extract Dragon Ball Z Id from URL
export const getDragonBallZIdFromUrl = (url: string): number | null => {
  for (const character of mockDragonBallZData) {
    if (url.includes(`/${character.id}`)) {
      return character.id;
    }
  }
  return null;
};

// Setup axios spy for Dragon Ball Z endpoints
    axiosGetService = jest.spyOn(axios, 'get');
    axiosGetService.mockImplementation((url: string) => {
      if (url.includes('dragonball-api.com')) {
        const id = getDragonBallZIdFromUrl(url);
        if (id !== null) {
          const data = mockDragonBallZData.find(
            (dragonBall) => dragonBall.id === id,
          );
          return Promise.resolve({ data: data });
        }
      }
      return Promise.reject(new Error(`No mock configured for URL: ${url}`));
    });
```

This straightforward approach allows us to match endpoint paths regardless of the base URL, ensuring our tests work correctly no matter where the application is hosted.
