# sdjpa

CRUD de usuários com **Spring Boot**, **Spring Data JPA** e **MySQL**, com front-end simples em HTML + Alpine.js.

## Tecnologias

- Java 17
- Spring Boot 4.1.1
- Spring Data JPA / Hibernate
- MySQL
- Lombok
- Maven
- Alpine.js (front-end)

## Funcionalidades

- Cadastrar usuário (nome, idade)
- Listar usuários
- Editar usuário
- Excluir usuário
- Busca por nome no front-end

## Pré-requisitos

- JDK 17+
- Maven (ou use o wrapper `./mvnw` incluso no projeto)
- MySQL rodando localmente (testado com MySQL80 / porta 3306)

## Configuração do banco de dados

Crie o banco antes de rodar a aplicação (caso ainda não exista):

```sql
CREATE DATABASE IF NOT EXISTS sdjpa;
```

As credenciais de conexão ficam em `src/main/resources/application.properties`:

```properties
spring.application.name=sdjpa
server.port=3000

spring.datasource.url=jdbc:mysql://localhost:3306/sdjpa
spring.datasource.username=root
spring.datasource.password=root

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> ⚠️ Ajuste usuário e senha conforme o seu ambiente. Evite deixar credenciais reais commitadas em repositórios públicos — prefira variáveis de ambiente (ex.: `${DB_PASSWORD}`) quando for publicar o projeto.

A tabela é criada/atualizada automaticamente pelo Hibernate (`spring.jpa.hibernate.ddl-auto=update`), a partir da entidade `User`. O nome da tabela gerado é `user` (singular, minúsculo — padrão do Hibernate para o nome da classe).

### Populando o banco com dados de exemplo

```sql
USE sdjpa;

INSERT INTO user (nome, idade) VALUES
('Ana Silva', 28),
('Bruno Costa', 34),
('Carla Mendes', 22),
('Diego Oliveira', 45),
('Elaine Souza', 31),
('Fábio Lima', 19),
('Gabriela Rocha', 27),
('Henrique Alves', 52),
('Isabela Martins', 24),
('João Pereira', 38);
```

### Dump do banco

Um dump completo (estrutura + dados) pode ser gerado com:

```bash
mysqldump -u root -p sdjpa > db/dump.sql
```

Para restaurar em outra máquina:

```bash
mysql -u root -p sdjpa < db/dump.sql
```

## Como rodar

```bash
./mvnw spring-boot:run
```

A aplicação sobe na porta `3000` (configurada em `server.port`). Acesse:

```
http://localhost:3000
```

## Estrutura do projeto

```
src/main/java/com/spring/sdjpa
├── SdjpaApplication.java            # classe principal
├── domain/User.java                 # entidade JPA (id, nome, idade)
├── repository/UserRepository.java   # Spring Data JPA
├── service/UserService.java         # regras de negócio
└── controller/UserController.java   # endpoints REST

src/main/resources
├── application.properties
└── static/                          # front-end (HTML, CSS, JS com Alpine.js)

db/
└── dump.sql                         # dump opcional do banco (estrutura + dados)
```

## Endpoints da API

| Método | Rota          | Descrição                |
|--------|---------------|---------------------------|
| GET    | `/users`      | Lista todos os usuários   |
| GET    | `/users/{id}` | Busca um usuário por id   |
| POST   | `/users`      | Cria ou atualiza usuário  |
| DELETE | `/users/{id}` | Remove um usuário         |

## Notas

- O campo `email` foi avaliado durante o desenvolvimento, mas removido — a entidade `User` mantém apenas `nome` e `idade`.
- Caso apareça uma tabela `users` (plural) no schema além de `user` (singular), ela não é usada pela aplicação e pode ser removida com `DROP TABLE users;`.

## Licença

Projeto de estudo, sem licença específica definida.
