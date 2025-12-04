# API HabitFlow 🎯

API HabitFlow fornece autenticação segura, gestão completa de hábitos (CRUD) e registro diário de progresso. Desenvolvida com Node.js e Prisma, garante persistência, organização e escalabilidade. Serve como base sólida para futuros recursos como streaks, analytics e notificações.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Exemplos de Requisições](#exemplos-de-requisições)
- [Recursos Futuros](#recursos-futuros)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🚀 Sobre o Projeto

A API HabitFlow é uma solução backend robusta e escalável para o gerenciamento de hábitos pessoais. O projeto foi desenvolvido com foco em segurança, performance e facilidade de manutenção, oferecendo uma base sólida para aplicações de acompanhamento de hábitos.

## ✨ Funcionalidades

### Autenticação Segura
- 🔐 Sistema de autenticação completo com JWT
- 🔑 Registro e login de usuários
- 🛡️ Proteção de rotas e validação de tokens
- 🔒 Criptografia de senhas com bcrypt

### Gestão de Hábitos (CRUD)
- ✏️ Criar novos hábitos personalizados
- 📖 Visualizar lista de hábitos do usuário
- 🔄 Atualizar informações dos hábitos
- 🗑️ Remover hábitos
- 🏷️ Categorização e organização de hábitos

### Registro Diário de Progresso
- ✅ Marcar hábitos como completados diariamente
- 📊 Acompanhamento do histórico de progresso
- 📅 Visualização de dados por período
- 📈 Base para cálculo de estatísticas

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista e flexível
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js e TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** / **[MySQL](https://www.mysql.com/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação via JSON Web Tokens
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Criptografia de senhas
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Gerenciamento de variáveis de ambiente

## 🏗️ Arquitetura

A API HabitFlow segue princípios de arquitetura limpa e organizada:

```
API_HabitFlow/
├── prisma/
│   └── schema.prisma      # Schema do banco de dados
├── src/
│   ├── controllers/       # Lógica de controle das rotas
│   ├── middlewares/       # Middlewares de autenticação e validação
│   ├── models/            # Modelos de dados
│   ├── routes/            # Definição de rotas da API
│   ├── services/          # Lógica de negócios
│   └── utils/             # Funções utilitárias
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts
└── server.js              # Ponto de entrada da aplicação
```

### Principais Características Arquiteturais:

- **Separação de responsabilidades**: Controllers, Services e Models bem definidos
- **Middleware de autenticação**: Proteção de rotas sensíveis
- **Validação de dados**: Garantia de integridade das informações
- **Tratamento de erros**: Sistema robusto de error handling
- **Persistência de dados**: Gerenciada pelo Prisma ORM

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) ou [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/thalles-j/API_HabitFlow.git
cd API_HabitFlow
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

5. (Opcional) Gere o Prisma Client:
```bash
npx prisma generate
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/habitflow"

# JWT
JWT_SECRET="seu_secret_key_aqui"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"
```

## 🎮 Uso

### Desenvolvimento

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

### Produção

Execute a aplicação em modo de produção:

```bash
npm start
# ou
yarn start
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada).

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Registrar novo usuário | Não |
| POST | `/api/auth/login` | Fazer login | Não |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/users/profile` | Obter perfil do usuário | Sim |
| PUT | `/api/users/profile` | Atualizar perfil | Sim |

### Hábitos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/habits` | Criar novo hábito | Sim |
| GET | `/api/habits` | Listar todos os hábitos do usuário | Sim |
| GET | `/api/habits/:id` | Obter detalhes de um hábito | Sim |
| PUT | `/api/habits/:id` | Atualizar hábito | Sim |
| DELETE | `/api/habits/:id` | Deletar hábito | Sim |

### Progresso

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/progress` | Registrar progresso diário | Sim |
| GET | `/api/progress/:habitId` | Obter histórico de progresso | Sim |
| GET | `/api/progress/today` | Obter progresso do dia | Sim |

## 💡 Exemplos de Requisições

### Registro de Usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### Criar Hábito

```bash
POST /api/habits
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Exercício Físico",
  "description": "Fazer 30 minutos de exercícios",
  "frequency": "daily",
  "category": "Saúde"
}
```

### Registrar Progresso

```bash
POST /api/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "habitId": "1",
  "completed": true,
  "date": "2024-01-15",
  "notes": "Completei a corrida matinal"
}
```

## 🔮 Recursos Futuros

A API HabitFlow está em constante evolução. Funcionalidades planejadas para próximas versões:

- 🔥 **Streaks**: Sistema de sequências para medir consistência
- 📊 **Analytics**: Dashboard com estatísticas e gráficos de progresso
- 🔔 **Notificações**: Lembretes personalizados via email ou push
- 👥 **Social**: Compartilhamento de hábitos e conquistas
- 🎯 **Metas**: Sistema de objetivos e marcos
- 🏆 **Gamificação**: Sistema de pontos, níveis e conquistas
- 📱 **API Mobile**: Endpoints otimizados para aplicativos móveis
- 🌐 **Internacionalização**: Suporte para múltiplos idiomas

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Escreva código limpo e bem documentado
- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Respeite o código de conduta do projeto

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Thalles J](https://github.com/thalles-j)
