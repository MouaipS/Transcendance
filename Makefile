include .env

all: up

up: 
	@mkdir -p ${DATA_PATH}
	@mkdir -p ${DATA_PATH}/frontend
	@mkdir -p ${DATA_PATH}/backend
	@mkdir -p ${DATA_PATH}/database
	@mkdir -p ${DATA_PATH}/nginx
	@mkdir -p ${DATA_PATH}/nginx/ssl
	@if [ ! -f  ${DATA_PATH}/nginx/ssl/certificat_transcendence.crt ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout  ${DATA_PATH}/nginx/ssl/certificat_transcendence.key \
		-out  ${DATA_PATH}/nginx/ssl/certificat_transcendence.crt \
		-subj "/CN=localhost" ;\
		chmod 644 ${DATA_PATH}/nginx/ssl/certificat_transcendence.key; \
	fi
	@mkdir -p ${DATA_PATH}/vault
	@mkdir -p ${DATA_PATH}/vault/data
	@mkdir -p ${DATA_PATH}/vault/tls
	@mkdir -p ${DATA_PATH}/vault/init
	@if [ ! -f  ${DATA_PATH}/vault/tls/vault.crt ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout  ${DATA_PATH}/vault/tls/vault.key \
		-out  ${DATA_PATH}/vault/tls/vault.crt \
		-subj "/CN=vault" \
		-addext "subjectAltName=DNS:vault,DNS:localhost,IP:127.0.0.1"; \
		chmod 644 ${DATA_PATH}/vault/tls/vault.key; \
	fi
	@docker compose -f ./docker-compose.yml up -d

down:
	@docker compose -f ./docker-compose.yml down 

clean: down
	@rm -rf ${DATA_PATH}

fclean: clean
	@docker system prune -af

re: fclean all

.PHONY:	
	all up down clean fclean re 
