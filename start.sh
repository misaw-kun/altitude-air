#!/bin/bash

start_client() {
  echo "Installing client dependencies..."
  cd client
  echo "VITE_API_BASE_URL=http://localhost:3001" > .env
  npm install
  echo "Starting client project..."
  npm run dev
  cd ..
}

start_api() {
  echo "Installing API dependencies..."
  cd api
  echo "JWT_SECRET=shhhsupersecrettoken!!" > .env
  npm install
  echo "Starting API project..."
  npm run dev
}

echo "Setting up the projects..."

start_client &

echo "Waiting for client project to start..."
sleep 15

start_api
