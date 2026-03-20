# --- STAGE 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install build essentials for certain node_modules if needed
RUN apk add --no-cache libc6-compat

# Copy configuration files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client (CRITICAL STEP)
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# --- STAGE 2: Runner ---
FROM node:22-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy only the necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Change ownership to the non-root user
USER nestjs

# Expose the port your NestJS app runs on (usually 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main"]