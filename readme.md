# **StyleManager API** ✂️💈  
**Sistema de Agendamentos para Barbearias e Salões**  

API completa para gerenciamento de agendamentos no setor de beleza, desenvolvida com Node.js, Fastify e Prisma ORM.

---
## ✨ **Funcionalidades Principais**
- ✅ Agendamentos com regras de negócio:
  - 6h de antecedência mínima para agendamentos no mesmo dia
  - Limite de 1 semana para agendamentos futuros
- ✅ Fluxo de confirmação por e-mail:
  - Validação obrigatória antes de persistir no banco
- ✅ Autenticação segura com JWT e Bcrypt
- ✅ Documentação automática com Swagger UI

---

## 🛠️ **Stack Tecnológica**
| Categoria       | Tecnologias                                                                 |
|----------------|---------------------------------------------------------------------------|
| **Backend**    | Fastify, TypeScript                                                       |
| **Banco de Dados** | SQLite + Prisma ORM                                                      |
| **Autenticação** | JWT, Bcrypt                                                              |
| **Datas**      | Day.js, Date-Holidays                                                     |
| **E-mails**    | Nodemailer                                                               |
| **Testes**     | Vitest                                                                   |
| **Ferramentas** | TSX, Tsup, Zod                                                          |

---

## ⚙️ **Configuração do Ambiente**

### 📋 Pré-requisitos
- Node.js 18+
- SQLite (vem com o Prisma)
- Yarn ou npm

### 🚀 Executando o projeto
1. **Clone o repositório**
   ```bash
   git clone https://github.com/StyleManager/schedulemaneger.git
   cd schedulemaneger
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o ambiente**
   Crie seu arquivo `.env` baseado no `.env.example`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="sua_chave_secreta_aqui"
   ```

4. **Execute as migrações do Prisma**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Popule o banco (opcional)**
   ```bash
   npm run seed
   ```

6. **Inicie o servidor**
   ```bash
   npm run dev
   ```

7. **Acesse a documentação**
   ```
   http://localhost:3333/docs
   ```

---

## 🧪 **Testes**
Execute a suíte de testes com:
```bash
npm test
```

---

## � **Revisão Técnica**

### ✅ **Pontos Fortes**
- **Stack moderna e performática** (Fastify, Prisma, TypeScript)
- **Type-safety** com Zod e TypeScript
- **Documentação automática** com Swagger UI
- **Separação de responsabilidades** (rotas, funções, middleware)
- **Regras de negócio bem implementadas** (validações de horário)
- **Fluxo de confirmação por e-mail** antes de persistir
- **Testes unitários** com Vitest
- **Containerização** com Docker

### ⚠️ **Pontos de Melhoria**

#### **Segurança**
- JWT implementado manualmente - migrar para `@fastify/jwt` plugin
- CORS aberto (`origin: "*"`) - restringir origens permitidas
- Falta validação de variáveis de ambiente com `.env.example`
- Implementar rate limiting para prevenir abuso de API
- Adicionar helmet para headers de segurança

#### **Arquitetura**
- Tipagem `any` no middleware - usar Fastify decorators
- Implementar error handler global
- Adicionar logging estruturado (Pino/Winston)
- Extrair constantes mágicas (números, strings hardcoded)
- Implementar padrão Repository para abstração de dados

#### **Banco de Dados**
- SQLite inadequado para produção - migrar para PostgreSQL
- Adicionar índices em campos consultados (`email`, `clientId`)
- Problema de race condition em `Horarios.livre`
- Implementar soft delete (`deletedAt`)
- Adicionar timestamps (`createdAt`, `updatedAt`)

#### **Testes**
- Adicionar testes de integração/E2E
- Testar rotas HTTP (não apenas funções isoladas)
- Configurar CI/CD (GitHub Actions) para testes automáticos
- Adicionar coverage reports (>80% cobertura)

#### **Código**
- Inconsistência idioma (português/inglês) - padronizar
- Adicionar JSDoc em funções públicas
- Corrigir typos (`destinary` → `destination`)
- Implementar ESLint + Prettier
- Adicionar pre-commit hooks (Husky)

---

## 📌 **Roadmap de Melhorias**

### 🔥 **Prioridade Alta (Curto Prazo)**
- [ ] **Migrar autenticação para `@fastify/jwt`**
  - Aproveitar integração nativa do Fastify
  - Usar cookies httpOnly para refresh tokens
  
- [ ] **Adicionar error handler global**
  ```typescript
  server.setErrorHandler((error, request, reply) => {
    // tratamento centralizado
  })
  ```

- [ ] **Implementar logging estruturado**
  - Usar Pino (integrado ao Fastify)
  - Adicionar request ID tracking
  
- [ ] **Corrigir race condition em agendamentos**
  - Usar transaction no Prisma
  - Implementar lock otimista/pessimista
  
- [ ] **Adicionar validação de .env**
  ```typescript
  // Criar .env.example
  // Validar no startup com Zod
  ```

- [ ] **Configurar ESLint + Prettier**
  - Padronizar formatação
  - Pre-commit hooks com Husky

### 🚀 **Prioridade Média (Médio Prazo)**
- [ ] **Migrar para PostgreSQL**
  - Usar Docker Compose para dev
  - Configurar pool de conexões
  
- [ ] **Implementar testes E2E**
  - Testar fluxos completos
  - Usar banco de dados em memória
  
- [ ] **Adicionar rate limiting**
  - `@fastify/rate-limit`
  - Prevenir abuso de endpoints
  
- [ ] **Implementar cache com Redis**
  - Cache de horários disponíveis
  - Cache de serviços/cabeleireiros
  
- [ ] **Adicionar paginação**
  - Implementar em listagens
  - Padrão cursor-based
  
- [ ] **Webhooks para notificações**
  - Integração com WhatsApp Business API
  - Notificações SMS (Twilio)

### 🎯 **Prioridade Baixa (Longo Prazo)**
- [ ] **Dashboard administrativo**
  - React/Next.js
  - Visualização de métricas
  - Gestão de cabeleireiros e serviços
  
- [ ] **Aplicativo móvel**
  - React Native
  - Notificações push
  
- [ ] **Sistema de avaliações**
  - Clientes avaliam atendimentos
  - Rating de cabeleireiros
  
- [ ] **Integração com calendários**
  - Google Calendar
  - iCal export
  
- [ ] **Migrar para microserviços**
  - Separar autenticação
  - Separar notificações
  - Message broker (RabbitMQ/Kafka)
  
- [ ] **Análise de dados**
  - Dashboard de métricas
  - Horários mais populares
  - Relatórios de faturamento

### 🛡️ **Segurança e DevOps**
- [ ] **CI/CD Pipeline**
  - GitHub Actions
  - Testes automáticos
  - Deploy automático
  
- [ ] **Monitoramento**
  - Sentry para error tracking
  - Prometheus + Grafana para métricas
  
- [ ] **Backup automatizado**
  - Backup diário do banco
  - Retenção de 30 dias
  
- [ ] **HTTPS obrigatório**
  - Certificados SSL/TLS
  - Configurar em produção

---

## 🤝 **Como Contribuir**
1. Faça um fork do projeto
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Envie um Pull Request

---

**Desenvolvido por [José Xavier](https://github.com/devZevitor)**  
---

### 💬 **Contato**
Encontrou um problema? Abra uma issue ou me chame no [https://www.linkedin.com/in/zevitor](#)!
