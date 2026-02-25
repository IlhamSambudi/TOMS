# ─────────────────────────────────────────────────────────────────
#  TOMS — Makefile shortcuts
#  Usage:  make <target>
# ─────────────────────────────────────────────────────────────────

.PHONY: up down build logs ps seed clean

## Start all services (build if needed)
up:
	docker compose -f docker/docker-compose.yml up --build -d

## Stop all services
down:
	docker compose -f docker/docker-compose.yml down

## Build images without starting
build:
	docker compose -f docker/docker-compose.yml build

## Tail logs from all services
logs:
	docker compose -f docker/docker-compose.yml logs -f

## Show running containers
ps:
	docker compose -f docker/docker-compose.yml ps

## Seed default admin user (admin / admin123)
seed:
	docker exec toms_backend node src/scripts/seedAdmin.js

## Stop and remove volumes (DESTROYS DB DATA)
clean:
	docker compose -f docker/docker-compose.yml down -v
