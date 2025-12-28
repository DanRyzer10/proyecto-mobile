# Entorno de Desarrollo Moodle con Docker

Este proyecto configura un entorno completo de Moodle para desarrollo local usando Docker Compose.

## Componentes

- **Moodle**: Plataforma LMS (puerto 8080)
- **MariaDB**: Base de datos (puerto 3306)
- **phpMyAdmin**: Gestor de base de datos web (puerto 8081)

## Requisitos Previos

- Docker instalado
- Docker Compose instalado

### Instalación de Docker en Ubuntu

```bash
# Actualizar repositorios
sudo apt update

# Instalar dependencias
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Agregar clave GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio de Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar tu usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar para aplicar los cambios
```

## Opciones de Instalación

### Opción 1: Con imagen Bitnami (Recomendada si funciona)

```bash
docker compose up -d
```

### Opción 2: Con build personalizado (Si Bitnami falla)

```bash
# Usar la configuración personalizada
docker compose -f docker-compose-custom.yml build
docker compose -f docker-compose-custom.yml up -d
```

### Opción 3: Con imagen oficial de Moodle

```bash
# Usar la configuración alternativa
docker compose -f docker-compose-alternative.yml up -d
```

## Uso

### Iniciar el entorno

```bash
# Levantar todos los contenedores
docker compose up -d

# Ver los logs
docker compose logs -f

# Ver solo los logs de Moodle
docker compose logs -f moodle
```

### Acceder a los servicios

- **Moodle**: http://localhost:8080
  - Usuario: `admin`
  - Contraseña: `admin123`
  - **Nota**: Si usas docker-compose-custom.yml o docker-compose-alternative.yml, necesitarás completar la instalación web la primera vez:
    1. Abre http://localhost:8080
    2. Selecciona idioma
    3. Configura la base de datos:
       - Tipo: MariaDB
       - Host: mariadb
       - Base de datos: moodle
       - Usuario: moodleuser
       - Contraseña: moodlepass
    4. Acepta los términos y completa la instalación
    5. Crea el usuario administrador

- **phpMyAdmin**: http://localhost:8081
  - Servidor: `mariadb`
  - Usuario: `root`
  - Contraseña: `rootpassword`

### Detener el entorno

```bash
# Detener los contenedores
docker compose stop

# Detener y eliminar los contenedores
docker compose down

# Detener, eliminar contenedores y volúmenes (CUIDADO: elimina los datos)
docker compose down -v
```

## Configuración de la Base de Datos

Las credenciales de la base de datos están configuradas en el archivo `docker-compose.yml`:

- **Host**: mariadb
- **Puerto**: 3306
- **Base de datos**: moodle
- **Usuario**: moodleuser
- **Contraseña**: moodlepass

## Volúmenes Persistentes

Los datos se guardan en volúmenes Docker para persistir entre reinicios:

- `mariadb_data`: Datos de la base de datos
- `moodle_data`: Archivos de Moodle
- `moodledata_data`: Datos de usuario de Moodle

## Comandos Útiles

```bash
# Ver contenedores en ejecución
docker compose ps

# Reiniciar un servicio específico
docker compose restart moodle

# Acceder a la consola de un contenedor
docker compose exec moodle bash

# Ver el uso de recursos
docker stats

# Limpiar contenedores detenidos e imágenes no usadas
docker system prune -a
```

## Personalización

Para cambiar las credenciales o configuración:

1. Edita el archivo `docker-compose.yml`
2. Si ya has iniciado los contenedores, debes recrearlos:
   ```bash
   docker compose down -v
   docker compose up -d
   ```

## Solución de Problemas

### Error: manifest for bitnami/moodle:latest not found

Si obtienes este error, usa una de las alternativas:

```bash
# Opción A: Build personalizado (recomendado)
docker compose -f docker-compose-custom.yml build
docker compose -f docker-compose-custom.yml up -d

# Opción B: Imagen oficial de Moodle
docker compose -f docker-compose-alternative.yml up -d
```

### El contenedor de Moodle no inicia

```bash
# Ver los logs
docker compose logs moodle

# Verificar que MariaDB esté corriendo
docker compose ps
```

### Error de permisos

```bash
# Reiniciar el contenedor
docker compose restart moodle
```

### Resetear completamente el entorno

```bash
# Detener y eliminar todo (incluidos volúmenes)
docker compose down -v

# Volver a levantar
docker compose up -d
```

## Desarrollo

Para desarrollo con código personalizado, puedes montar tu directorio local:

1. Crea un directorio para tu código:
   ```bash
   mkdir -p ./moodle-custom
   ```

2. Agrega un volumen en `docker-compose.yml` bajo el servicio moodle:
   ```yaml
   volumes:
     - ./moodle-custom:/bitnami/moodle/local
   ```

3. Reinicia los contenedores:
   ```bash
   docker compose down
   docker compose up -d
   ```

## Notas

- La primera vez que inicies Moodle puede tardar unos minutos en estar listo
- El usuario admin se crea automáticamente con las credenciales especificadas
- Para producción, cambia todas las contraseñas por defecto
- Los puertos pueden ser modificados en el archivo docker-compose.yml si están ocupados
