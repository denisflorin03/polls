# Docker Setup pentru Proiectul Polls

## 🐳 Comenzi Docker

### Pornire rapidă
```bash
# Build și pornire toate serviciile
make build
make up

# Sau direct
docker-compose up --build
```

### Comenzi utile
```bash
# Verifică statusul
make status

# Vezi logurile
make logs

# Oprește serviciile
make down

# Restart
make restart

# Curăță tot (atenție!)
make clean
```

## 🏗️ Structura Docker

### Servicii
- **postgres**: PostgreSQL 16 (port 5432)
- **backend**: Spring Boot (port 8081)
- **frontend**: React/Vite (port 3000)

### Volume
- `postgres_data`: Datele PostgreSQL persistente

### Network
- `polls-network`: Rețea internă pentru comunicare între servicii

## 🔧 Configurație

### Backend
- **Dockerfile**: Multi-stage build cu Maven
- **Profil**: `application-docker.properties`
- **Database**: Conectare la `postgres:5432`

### Frontend
- **Dockerfile**: Multi-stage build cu Node.js + Nginx
- **Proxy**: `/api/*` → `backend:8081`

### Database
- **Image**: PostgreSQL 16 Alpine
- **Port**: 5432 (exposed)
- **Health Check**: Verifică disponibilitatea

## 🚀 Deployment

### Development
```bash
# Pornește doar backend + database
make backend

# Pornește doar frontend
make frontend
```

### Production
```bash
# Build pentru producție
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## 🔍 Debugging

### Logs
```bash
# Toate serviciile
docker-compose logs -f

# Doar backend
docker-compose logs -f backend

# Doar database
docker-compose logs -f postgres
```

### Shell în container
```bash
# Backend
docker-compose exec backend bash

# Database
docker-compose exec postgres psql -U postgres -d pollsdb
```

## 📝 Note

- **Port 8081**: Backend Spring Boot
- **Port 3000**: Frontend React
- **Port 5432**: PostgreSQL
- **Network**: `polls-network` pentru comunicare internă
- **Volume**: `postgres_data` pentru persistența datelor
