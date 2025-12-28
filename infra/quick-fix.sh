#!/bin/bash

echo "================================================"
echo "  Solución rápida para Moodle con Docker"
echo "================================================"
echo ""
echo "Detecté que bitnami/moodle:latest no está disponible."
echo "Voy a usar una configuración personalizada que funciona."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado."
    exit 1
fi

echo "🔨 Construyendo imagen de Moodle..."
docker compose -f docker-compose-custom.yml build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error al construir la imagen."
    echo "Verifica que tengas conexión a internet."
    exit 1
fi

echo ""
echo "🚀 Levantando contenedores..."
docker compose -f docker-compose-custom.yml up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error al levantar los contenedores."
    exit 1
fi

echo ""
echo "⏳ Esperando a que Moodle esté listo..."
echo "   (esto puede tomar 2-3 minutos la primera vez)"
sleep 15

# Esperar a que Moodle responda
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo ""
        echo "================================================"
        echo "  ✅ ¡Moodle está listo!"
        echo "================================================"
        echo ""
        echo "📌 Primer paso: Completar instalación"
        echo ""
        echo "  1. Abre: http://localhost:8080"
        echo "  2. Sigue el asistente de instalación"
        echo "  3. Configuración de base de datos:"
        echo "     • Tipo: MariaDB"
        echo "     • Host: mariadb"
        echo "     • Base de datos: moodle"
        echo "     • Usuario: moodleuser"
        echo "     • Contraseña: moodlepass"
        echo ""
        echo "  🗄️  phpMyAdmin: http://localhost:8081"
        echo "     • Usuario: root"
        echo "     • Contraseña: rootpassword"
        echo ""
        echo "================================================"
        echo ""
        echo "💡 Comandos útiles:"
        echo "  Ver logs:    docker compose -f docker-compose-custom.yml logs -f"
        echo "  Detener:     docker compose -f docker-compose-custom.yml stop"
        echo "  Eliminar:    docker compose -f docker-compose-custom.yml down -v"
        echo ""
        exit 0
    fi
    attempt=$((attempt + 1))
    echo -n "."
    sleep 10
done

echo ""
echo "⚠️  Moodle está tardando más de lo esperado."
echo "Verifica los logs con:"
echo "  docker compose -f docker-compose-custom.yml logs -f moodle"
