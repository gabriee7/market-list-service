# Escolhe uma imagem oficial do Node.js
FROM node:20-alpine

ENV NODE_ENV=production

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o restante da aplicação
COPY . .

USER node

# Expõe a porta padrão (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
