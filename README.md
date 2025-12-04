# HabitFlow – Backend API

Este repositório contém o backend do **HabitFlow**, um sistema de acompanhamento de hábitos desenvolvido como projeto acadêmico para a **FOA**.  
A API fornece autenticação, gerenciamento de hábitos e registro de progresso diário, utilizando arquitetura REST e banco de dados relacional.

---

## 📌 Tecnologias Utilizadas

- **Node.js** (Runtime JavaScript)
- **Express** (Framework Web)
- **Prisma ORM** (Interação com Banco de Dados)
- **PostgreSQL** (Banco de Dados Relacional)
- **JWT** (Autenticação via Token)
- **BcryptJS** (Hash de senhas)
- **Day.js** (Manipulação de datas)

---

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [PostgreSQL](https://www.postgresql.org/)
- Gerenciador de pacotes (NPM ou Yarn)

---

## 🚀 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/thalles-j/API_HabitFlow.git
   cd API_HabitFlow/backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz da pasta `backend` e configure as seguintes variáveis:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/habitflow?schema=public"
   JWT_SECRET="sua_chave_secreta_super_segura"
   PORT=4000
   ```

4. **Configure o Banco de Dados (Prisma)**
   Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev --name init
   ```
   *(Opcional) Popule o banco com dados iniciais:*
   ```bash
   npm run prisma:seed
   ```

5. **Execute o Servidor**
   Para desenvolvimento (com auto-reload):
   ```bash
   npm run dev
   ```
   Para produção:
   ```bash
   npm start
   ```

   O servidor rodará em `http://localhost:4000`.

---

## 📡 Endpoints da API

### Autenticação (`/api/auth`)
- `POST /register` - Registrar novo usuário
- `POST /login` - Autenticar usuário

### Hábitos (`/api/habits`) - *Requer Token*
- `POST /` - Criar novo hábito
- `GET /` - Listar hábitos do usuário
- `PATCH /:id/toggle` - Marcar/Desmarcar hábito como concluído no dia
- `DELETE /:id` - Remover hábito

### Dias/Resumo (`/api`) - *Requer Token*
- `GET /day` - Obter detalhes do dia (hábitos completados vs possíveis)
- `GET /summary` - Resumo de progresso dos dias

---

## 📂 Estrutura do Projeto

```
backend/
├── prisma/             # Schemas e migrações do banco de dados
├── src/
│   ├── controllers/    # Lógica das requisições (Regras de negócio)
│   ├── middleware/     # Middlewares (ex: Autenticação)
│   ├── routes/         # Definição das rotas da API
│   ├── db.js           # Instância do Prisma Client
│   └── server.js       # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente (não versionado)
└── package.json        # Dependências e scripts
```

---

## 🟢 Funcionalidades (MVP)
### Autenticação
- Registro de usuário  
- Login com JWT  
- Proteção de rotas autenticadas  

### Hábitos (CRUD)
- Criar hábito  
- Listar hábitos do usuário  
- Atualizar hábito  
- Deletar hábito  

### Registro Diário
- Marcar hábito como concluído no dia  
- Histórico salvo via Prisma no PostgreSQL  

---

## 🚀 Possíveis Expansões Futuras
- Sistema de streaks  
- Badges e conquistas  
- Painel com gráficos e estatísticas  
- Categorias e tags  
- Notificações e lembretes  
- Funcionalidades sociais  

---

## 🎓 Objetivo Acadêmico
Projeto desenvolvido como parte de um trabalho da FOA, com o objetivo de praticar desenvolvimento backend, APIs REST, autenticação e integração com banco de dados relacional.

## 👤 Autor
Thalles Silva

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.