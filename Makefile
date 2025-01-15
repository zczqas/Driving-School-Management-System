DOCKER_CONTAINER_ID := $(shell docker ps | awk '/sfds_web/ {print $$1}')

#@echo "CONATAINER ID :- $(DOCKER_CONTAINER_ID)"
setup:
	@mkdir -p "chart" "media" "media/driver_ed_images" "media/driver_ed_videos"  "video" "logo" "logo/hero" "ics"
	@cd alembic && mkdir -p "versions"
dev:
	@docker-compose --env-file .env up --build -d
dev-down:
	@docker-compose down
dev-logs:
	@docker-compose logs -f
dev-restart:
	@docker-compose restart

prod:
	@docker-compose --env-file .envprod up --build -d && docker system prune -f

migrate:
	@echo "Migrating database with message: $(msg)"
	@docker exec -it $(DOCKER_CONTAINER_ID) /bin/bash -c "alembic revision -m '$(msg)' --autogenerate"
	@docker exec -it $(DOCKER_CONTAINER_ID) /bin/bash -c "alembic upgrade head"
