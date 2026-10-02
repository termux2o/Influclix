
start Backend:
uvicorn app.main:app --reload

redis:
docker compose -f docker-compose-redis.yml down redis
docker compose -f docker-compose-redis.yml up redis