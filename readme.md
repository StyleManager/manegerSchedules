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

## 📌 **Próximos Passos**
- [ ] Implementar microserviços
- [ ] Adicionar integração com WhatsApp
- [ ] Criar dashboard administrativo

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
