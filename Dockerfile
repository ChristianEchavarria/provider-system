# Usa una imagen oficial de Python ligera
FROM python:3.10-slim

# Evita que Python escriba archivos .pyc y fuerza el buffer de stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establece el directorio de trabajo principal
WORKDIR /app

# Copia las dependencias primero para aprovechar el caché de Docker
COPY provider_system/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia las carpetas necesarias manteniendo la estructura relativa
# Se asume que el build context es la raíz del proyecto (padre de provider_system)
COPY vision-processor /app/vision-processor
COPY provider_system /app/provider_system

# Cambia al directorio donde está main.py
WORKDIR /app/provider_system

# El puerto se define por la variable de entorno $PORT en Cloud Run
# Por defecto usamos 8080 si no está definido
ENV PORT=8080

# Comando de ejecución usando shell form para expandir la variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
