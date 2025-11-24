# Backend Service

This directory contains the backend service for the Jedy-StarWarsKubernetes project. It is a Python-based RESTful API built with the [FastAPI](https://fastapi.tiangolo.com/) framework.

## Architecture

The backend service is responsible for:

- **User Management**: Handling user registration and login.
- **SWAPI Proxy**: Acting as a backend-for-frontend (BFF) by fetching data from the public [Star Wars API (SWAPI)](https://swapi.dev/).
- **Database Interaction**: Using [SQLModel](https://sqlmodel.tiangolo.com/) to interact with the PostgreSQL database for storing user data.

## Dependencies

The main dependencies for this service are:

- `fastapi`: The web framework.
- `uvicorn`: The ASGI server.
- `sqlmodel`: The database ORM.
- `psycopg2-binary`: The PostgreSQL adapter for Python.
- `python-jose[cryptography]`: For JWT creation and validation.
- `passlib[bcrypt]`: For password hashing.
- `httpx`: For making HTTP requests to the SWAPI.
- `pytest`: The testing framework.

For a complete list of dependencies, please see the `pyproject.toml` file.

## Testing

This service includes a comprehensive testing suite built with `pytest`. The tests are located in the `tests` directory and follow a Test-Driven Development (TDD) approach.

To run the tests, use the following command from the project root:

```bash
docker-compose exec back pytest
```

The tests are configured to run against a separate, in-memory SQLite database to ensure test isolation.

## Development

This service is configured to use a [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers) for a consistent and isolated development environment. To get started:

1. Open this directory (`back`) in VS Code.
2. When prompted, click "Reopen in Container" to launch the Dev Container.
