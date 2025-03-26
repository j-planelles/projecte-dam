FROM python:3.13.2-slim-bullseye

RUN python -m venv /opt/venv

ENV PATH=/opt/venv/bin:$PATH

RUN pip install --no-cache-dir --upgrade pip

# Set Python-related environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install os dependencies for our container
RUN apt-get update && apt-get install -y \
    # for postgres
    libpq-dev \
    # other
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app

WORKDIR /app

COPY requirements.txt /tmp/requirements.txt

COPY ./src /app

RUN pip install --no-cache-dir -r /tmp/requirements.txt


COPY ./docker-entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh

RUN apt-get remove --purge -y \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

CMD ["/opt/entrypoint.sh"]
