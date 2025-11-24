FROM python:3.14-slim

RUN apt-get update && apt-get install -y curl

WORKDIR /app

RUN pip install uv

COPY pyproject.toml .

RUN uv pip install --system -r pyproject.toml

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000", "--reload"]
