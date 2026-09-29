@echo off
title L'Elixir - Tienda de Perfumes (Backend + Frontend)
echo ======================================================================
echo    Iniciando L'Elixir - Tienda de Perfumes de Autor
echo ======================================================================
echo.

echo 1. Iniciando Servidor Backend FastAPI (http://localhost:8000)...
start "Backend FastAPI" cmd /k "python -m uvicorn app.main:app --reload --port 8000"

echo 2. Iniciando Servidor Frontend Vite (http://localhost:5173)...
cd tienda-frontend
start "Frontend Vite" cmd /k "npm run dev"

echo.
echo Todo listo! Puedes acceder en tu navegador a:
echo - Frontend: http://localhost:5173
echo - Documentacion API (Swagger): http://localhost:8000/docs
echo ======================================================================
