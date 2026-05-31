# Stage 1: Build the React application
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with FastAPI
FROM python:3.9-slim
WORKDIR /app

# Install dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI backend
COPY api /app/api

# Copy React build artifacts
COPY --from=build-stage /app/dist /app/dist

# Render will supply a PORT environment variable (default 10000)
ENV PORT=8000
EXPOSE $PORT

# Start Uvicorn pointing to the api module
CMD uvicorn api.main:app --host 0.0.0.0 --port $PORT
