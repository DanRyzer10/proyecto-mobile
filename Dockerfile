FROM php:8.1-apache

# 1. Instalar dependencias del sistema
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

# 2. Configurar y instalar extensiones PHP
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

# 3. Habilitar módulos de Apache
RUN a2enmod rewrite expires headers

# 4. Configurar límites de PHP (Esto está perfecto)
RUN { \
    echo 'upload_max_filesize = 256M'; \
    echo 'post_max_size = 256M'; \
    echo 'memory_limit = 512M'; \
    echo 'max_execution_time = 300'; \
    echo 'max_input_vars = 5000'; \
    echo 'max_input_time = 300'; \
    } > /usr/local/etc/php/conf.d/moodle.ini

RUN mkdir -p /var/www/moodledata && \
    mkdir -p /var/www/html && \
    chown -R www-data:www-data /var/www/html /var/www/moodledata && \
    chmod -R 755 /var/www/html && \
    chmod -R 770 /var/www/moodledata

WORKDIR /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]