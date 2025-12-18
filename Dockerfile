# Estágio 1: Instalação de dependências e construção (builder stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json npm.lock* package-lock.json* ./
RUN npm install --frozen-lockfile 
COPY . .
RUN npm run build

# Estágio 2: Execução em produção (runner stage)
FROM node:20-alpine AS runner
WORKDIR /app

# Configura o usuário para segurança (prática recomendada)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Define variáveis de ambiente para Next.js standalone (opcional, mas eficiente)
# Se você usa next.config.mjs com output: 'standalone', descomente a linha abaixo
# ENV NEXT_TELEMETRY_DISABLED 1

# Copia apenas os arquivos necessários do estágio builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env* ./

# Define o usuário de execução
USER nextjs

EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"]
