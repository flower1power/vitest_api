# Stage: tests - lightweight image for running tests
FROM oven/bun:1.3.10-slim AS tests

WORKDIR /usr/workspace

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Stage: report - with Java/Allure for generating reports
FROM tests AS report

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openjdk-21-jre-headless curl && \
    curl -Ls https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.24.0/allure-commandline-2.24.0.tgz \
    | tar -xz -C /opt && \
    ln -s /opt/allure-2.24.0/bin/allure /usr/local/bin/allure && \
    rm -rf /var/lib/apt/lists/*
