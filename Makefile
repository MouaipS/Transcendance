all: up

up: 
	@mkdir -p /home/adrouin/data/frontend
	@mkdir -p /home/adrouin/data
	@mkdir -p /home/adrouin/data/backend
	@mkdir -p /home/adrouin/data/nginx
	@mkdir -p /home/adrouin/data/database
	@docker compose -f ./docker-compose.yml up -d

down:
	@docker compose -f ./docker-compose.yml down -v

clean: down
	@rm -rf /home/adrouin/data

fclean: clean
	@docker system prune -af

re: fclean all

.PHONY:	
	all up down clean fclean re 