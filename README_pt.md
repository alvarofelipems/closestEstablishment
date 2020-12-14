# Estabelecimento mais próximo
> *This file is also available in english [here](README.md).*

Dada uma coordenada geográfica, o serviço irá procurar na base de dados
os estabelecimentos que atendem a esta área e localizar o que se encontra mais próximo.

> Essa aplicação está hospedada [aqui](http://ec2-52-54-128-153.compute-1.amazonaws.com/).

## Pré-Requisitos

Neste projeto foi utilizada a idéia de containerização para isolar cada serviço da aplicação para que seja possível rodar localmente e em produção com a experiência mais próxima possível.

Para rodar a aplicação, será necessário ter o [docker](LINKPARAODOCKER) instalado na sua máquina e o [docker-compose](LINKDOCKERCOMPOSE) para orquestrar os containers.

## Instalação:

### 1. Clonando:

Você precisa clonar o repositório


```
git clone https://github.com/alvarofelipems/closestEstablishment
```

### 2. Rodando a aplicação:

Dentro do diretório em que o projeto foi clonado rode os comando e aguarde até o fim do processo.
```
./application install
```

```
./application start
```

### 3. Semeando:
Vamos adicionar alguns estabelecimentos na base de dados para que possamos testar a aplicação com o comando:


```
./application populate
```

## Front-end

Abra em seu navegador o seu endereço local que provavelmente é
[http://localhost/](http://localhost/)

Neste link você verá uma aplicação front-end para testar a API

Ao clicar em qualquer ponto do mapa, será apresentada a localização do estabelecimento mais próximo e destacada a área de atendimento.



## Testes
A aplicação conta com testes e para executá-los use o comando

```
./application test
```

A cobertura de testes foi desenvolvida apenas para a API do projeto
e os casos de testes estão na pasta `api/tests`

Foram utilizadas as ferramentas:
- [tape](https://www.npmjs.com/package/tape)
- [supertest](https://www.npmjs.com/package/supertest)



## Arquitetura

No `docker-compose.yml` estão definidos os seguintes serviços e vou explicar aqui a função de cada um.

Serviços:
- API
- webserver_api
- mongo
- mongo-express
- web
- webserver_web


### API
A `API` é o serviço foco desse projeto e tem a função de:
* Cadastrar estabelecimentos
* Mostrar um estabelecimento específico através do seu `id`
* Encontrar o estabelecimento mais próximo

### Mongo DB
O *MongoDB* é um banco de dados orientado a documentos e foi escolhido para o projeto pelas observando as vantages:
* Facilita o armazenamento de objetos de estrutura complexa
* Possui vários recursos para processar GeoJSON
* Consultas simples e rápidas

### Mongo Express

Interface para administrar o MongoDB

### Webserver API

O NGINX foi utilizado para receber as requisições e fazer o balanceamento da carga, dividindo-a entre entre as várias instâncias da [API](#api)

### WEB

Sistema frontend que irá consumir a API

### Webserver WEB

Tem o mesmo objetivo do Webserver API, só que para WEB

## Desligando
Quando quiser encerrar tudo que estiver rodando em sua máquina, basta rodar o comando:

```
./application stop
```

## Se você ama o Postman ❤️

Poderá fazer o download da collection [aqui](https://www.postman.com/collections/e5f281994138a13a156f)
