include .env

all: up

up: 
	@mkdir -p ${DATA_PATH}
	@mkdir -p ${DATA_PATH}/frontend
	@mkdir -p ${DATA_PATH}/backend
	@mkdir -p ${DATA_PATH}/nginx
	@mkdir -p ${DATA_PATH}/database
	@docker compose -f ./docker-compose.yml up -d

down:
	@docker compose -f ./docker-compose.yml down -v

clean: down
	@rm -rf ${DATA_PATH}

fclean: clean
	@docker system prune -af

re: fclean all

.PHONY:	
	all up down clean fclean re 
