# Makefile pentru proiectul Polls

.PHONY: help build up down logs clean restart

# Help
help:
	@echo "Available commands:"
	@echo "  make build    - Build all containers"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make restart  - Restart all services"
	@echo "  make backend  - Start only backend"
	@echo "  make frontend - Start only frontend"
	@echo "  make db       - Start only database"

# Build all containers
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Remove all containers and volumes
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Restart all services
restart: down up

# Start only backend
backend:
	docker-compose up -d postgres backend

# Start only frontend
frontend:
	docker-compose up -d frontend

# Start only database
db:
	docker-compose up -d postgres

# Check services status
status:
	docker-compose ps
