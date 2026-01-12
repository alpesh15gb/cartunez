FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libicu-dev \
    libxml2-dev \
    libxslt1-dev \
    libzip-dev \
    libonig-dev \
    curl \
    unzip \
    git \
    cron \
    libmagickwand-dev --no-install-recommends \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Configure GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install \
    bcmath \
    ctype \
    dom \
    fileinfo \
    filter \
    gd \
    hash \
    iconv \
    intl \
    mbstring \
    opcache \
    pdo_mysql \
    simplexml \
    soap \
    sockets \
    xsl \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Create Magento user (matches host user usually, can be overridden)
ARG APP_USER_ID=1000
ARG APP_GROUP_ID=1000

RUN groupadd -g ${APP_GROUP_ID} magento && \
    useradd -u ${APP_USER_ID} -g magento -m magento && \
    usermod -p "*" magento -s /bin/bash

# Configuration
COPY ./.docker/php/php.ini /usr/local/etc/php/conf.d/z-magento.ini

WORKDIR /var/www/html

USER magento
