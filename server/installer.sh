#!/bin/bash

# Sortir inmediatament si alguna comanda surt amb un codi que no és 0
set -e

echo "######################################################################"
echo "#                                                                    #"
echo "#          Welcome to the Ultra Workout Server Installer!            #"
echo "#                                                                    #"
echo "######################################################################"
echo ""
echo "This script will guide you through the installation and initial"
echo "configuration of the Ultra Workout Server."
echo ""
echo "--------------------------------- NOTICE ---------------------------------"
echo "This script requires an active internet connection to clone the repository."
echo "It will create a directory named 'projecte-dam' in the current location:"
echo "  $(pwd)/projecte-dam"
echo "If this directory already exists, you will be prompted to remove it."
echo "Ensure you have Docker and Git installed and accessible in your system's PATH."
echo "--------------------------------------------------------------------------"
echo ""
echo "The script will configure a PostgreSQL database that runs within a Docker container."
echo "No changes will be made to any existing system-wide PostgreSQL installations."
echo ""

read -n 1 -s -r -p "Press any key to continue to start the installation..." </dev/tty
echo ""
echo ""

# Preguntar pel nom del servidor
DEFAULT_SERVER_NAME="Ultra Workouts Server"
read -r -p "Enter the server name (default: \"${DEFAULT_SERVER_NAME}\"): " user_server_name </dev/tty
SERVER_NAME=${user_server_name:-$DEFAULT_SERVER_NAME}
echo ""

# Comprobar per l'executable de Docker al PATH
if ! command -v docker &>/dev/null; then
  echo "Error: docker could not be found in your PATH."
  echo "Please install Docker and ensure it's in your PATH."
  exit 1
fi
echo "Docker executable found."

# Comprobar per l'executable de Git al PATH
if ! command -v git &>/dev/null; then
  echo "Error: git could not be found in your PATH."
  echo "Please install Git and ensure it's in your PATH."
  exit 1
fi
echo "Git executable found."
echo ""

# Mirar si docker s'ha d'executar com a root
echo "Checking Docker permissions..."
DOCKER_PREFIX="" # Serà "sudo " si cal

# Probar Docker com a usuari normal
if docker ps -q &>/dev/null; then
  echo "Docker commands can be run by the current user without sudo."
else
  echo "INFO: Docker command 'docker ps -q' failed without sudo."
  echo "      This usually means your user is not in the 'docker' group or the Docker daemon requires root privileges."
  echo "      Attempting to use 'sudo' for Docker commands..."

  if ! command -v sudo &>/dev/null; then
    echo "Error: 'sudo' command not found, but Docker seems to require elevated privileges."
    echo "Please install 'sudo' or configure Docker to run without root (e.g., add user to 'docker' group and relogin)."
    exit 1
  fi

  # Probar docker amb sudo
  if sudo docker ps -q &>/dev/null; then
    echo "Successfully ran 'sudo docker ps -q'. Docker commands will be executed with 'sudo'."
    DOCKER_PREFIX="sudo "
  else
    # Missatge d'error si `sudo docker ps -q` falla.
    echo "Error: 'sudo docker ps -q' also failed."
    echo "Possible reasons:"
    echo "  - Docker daemon is not running (try: systemctl status docker / service docker status)."
    echo "  - Your user does not have sudo privileges for Docker commands (check /etc/sudoers)."
    echo "  - Incorrect sudo password entered if prompted."
    echo "Please ensure Docker is running and you have the necessary permissions."
    exit 1
  fi
fi
echo ""

# Definir directori d'instal·lació
INSTALL_BASE_DIR=$(pwd)
PROJECT_DIR_NAME="projecte-dam"
INSTALL_DIR="${INSTALL_BASE_DIR}/${PROJECT_DIR_NAME}"

echo "Installing Ultra Workout Server..."
echo "Installation target directory: ${INSTALL_DIR}"
echo ""

# Comprobar si existeix
if [ -d "${PROJECT_DIR_NAME}" ]; then
  echo "Warning: Directory '${PROJECT_DIR_NAME}' already exists."
  read -r -p "Do you want to remove it and re-clone? (y/N): " confirm_remove </dev/tty
  if [[ "${confirm_remove,,}" == "y" || "${confirm_remove,,}" == "yes" ]]; then
    echo "Removing existing directory: ${PROJECT_DIR_NAME}"
    rm -rf "${PROJECT_DIR_NAME}"
  else
    echo "Installation aborted by user. Please remove the directory manually or choose a different location."
    exit 1
  fi
fi

# Clonar el repositori
git clone https://github.com/j-planelles/projecte-dam
echo "Repository cloned."
echo ""

# Anar a la carpeta server
cd "${PROJECT_DIR_NAME}/server"
echo "Changed directory to $(pwd)"
echo ""

# Crear el fitxer .env
cp .env.example .env
echo ".env file created from .env.example"
echo ""

echo "Configuring .env file..."
# Generar POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(openssl rand -hex 16)
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" .env
echo "POSTGRES_PASSWORD set."

# Generar OAUTH2_SECRET_KEY
OAUTH2_SECRET_KEY=$(openssl rand -hex 32)
sed -i "s|^OAUTH2_SECRET_KEY=.*|OAUTH2_SECRET_KEY=${OAUTH2_SECRET_KEY}|" .env
echo "OAUTH2_SECRET_KEY set."

# Esmenar ULTRA_BACKEND_NAME
# Eliminar caràcters especials pel sed: & \ /
ESCAPED_SERVER_NAME=$(printf '%s\n' "$SERVER_NAME" | sed -e 's/[\&/]/\\&/g')
sed -i "s|^ULTRA_BACKEND_NAME=.*|ULTRA_BACKEND_NAME=\"${ESCAPED_SERVER_NAME}\"|" .env
echo "ULTRA_BACKEND_NAME set to: \"${SERVER_NAME}\""
echo ""

echo "Building Docker containers..."
# Fer build dels contenidors, no els arrenca
${DOCKER_PREFIX}docker compose build
echo ""

echo "Installation done!"
echo "To execute this container, navigate to '${INSTALL_DIR}/server' and run:"
echo "  ${DOCKER_PREFIX}docker compose up -d"
echo ""
echo "The server should then be accessible, typically on port 8002 (as per .env)."
echo "The configured server name is: \"${SERVER_NAME}\""
