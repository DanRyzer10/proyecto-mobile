FROM php:8.1-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    libxslt1-dev \
    libldap2-dev \
    git \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configurar y instalar extensiones PHP necesarias para Moodle
RUN docker-php-ext-configure gd --with-freetype --with-jpeg=/usr \
    && docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ \
    && docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    pdo \
    pdo_mysql \
    opcache \
    intl \
    soap \
    zip \
    exif \
    ldap

# Habilitar módulos de Apache
RUN a2enmod rewrite expires headers

# Configurar límites de PHP para Moodle
RUN { \
    echo 'upload_max_filesize = 256M'; \
    echo 'post_max_size = 256M'; \
    echo 'memory_limit = 512M'; \
    echo 'max_execution_time = 300'; \
    echo 'max_input_vars = 5000'; \
    echo 'max_input_time = 300'; \
    } > /usr/local/etc/php/conf.d/moodle.ini

# Descargar Moodle 4.4 (última versión estable)
RUN cd /tmp && \
    curl -L "https://download.moodle.org/download.php/direct/stable404/moodle-4.4.4.tgz" -o moodle.tgz && \
    tar -xzf moodle.tgz -C /var/www/html/ --strip-components=1 && \
    rm moodle.tgz

# Crear directorio de datos y configurar permisos
RUN mkdir -p /var/www/moodledata && \
    chown -R www-data:www-data /var/www/html /var/www/moodledata && \
    chmod -R 755 /var/www/html && \
    chmod -R 770 /var/www/moodledata

WORKDIR /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
