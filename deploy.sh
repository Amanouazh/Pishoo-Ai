#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
PROJECT_DIR="/home/ubuntu/pishoo-ai"
FRONTEND_DIR="${PROJECT_DIR}/frontend"
BACKEND_DIR="${PROJECT_DIR}/backend"
NGINX_CONF_PATH="/etc/nginx/sites-available/pishoo-ai"
NGINX_SYMLINK_PATH="/etc/nginx/sites-enabled/pishoo-ai"
SYSTEMD_SERVICE_PATH="/etc/systemd/system/pishoo-ai.service"
YOUR_DOMAIN="your_domain.com" # IMPORTANT: Replace with your actual domain

echo "Starting Pishoo AI deployment script..."

# --- 1. Update and Install System Dependencies ---
echo "Updating system packages and installing dependencies..."
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx python3-venv python3-pip

# --- 2. Frontend Setup and Build ---
echo "Setting up and building frontend..."
cd "${FRONTEND_DIR}"

# Install pnpm if not already installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found, installing..."
    npm install -g pnpm
fi

pnpm install
pnpm run build

# --- 3. Backend Setup ---
echo "Setting up backend..."
cd "${BACKEND_DIR}"

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
pip install gunicorn

# Deactivate virtual environment
deactivate

# --- 4. Copy Frontend Build to Backend Static ---
echo "Copying frontend build to backend static directory..."
rm -rf "${BACKEND_DIR}/src/static/*"
cp -r "${FRONTEND_DIR}/dist/." "${BACKEND_DIR}/src/static/"

# --- 5. Configure Nginx ---
echo "Configuring Nginx..."

# Replace placeholder domain in nginx.conf
sed -i "s/your_domain.com/${YOUR_DOMAIN}/g" "${PROJECT_DIR}/nginx.conf"
sed -i "s/www.your_domain.com/www.${YOUR_DOMAIN}/g" "${PROJECT_DIR}/nginx.conf"

sudo cp "${PROJECT_DIR}/nginx.conf" "${NGINX_CONF_PATH}"

# Create symlink if it doesn't exist
if [ ! -L "${NGINX_SYMLINK_PATH}" ]; then
    sudo ln -s "${NGINX_CONF_PATH}" "${NGINX_SYMLINK_PATH}"
fi

# Remove default Nginx site
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm "/etc/nginx/sites-enabled/default"
fi

sudo nginx -t
sudo systemctl restart nginx

# --- 6. Configure Gunicorn and Systemd ---
echo "Configuring Gunicorn and Systemd service..."

# Create Gunicorn start script
cat <<EOF > "${BACKEND_DIR}/start_gunicorn.sh"
#!/bin/bash
cd "${BACKEND_DIR}"
source venv/bin/activate
exec gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
EOF
chmod +x "${BACKEND_DIR}/start_gunicorn.sh"

# Create systemd service file
sudo bash -c "cat <<EOF > ${SYSTEMD_SERVICE_PATH}
[Unit]
Description=Gunicorn instance for Pishoo AI Flask app
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=${BACKEND_DIR}
ExecStart=${BACKEND_DIR}/start_gunicorn.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl start pishoo-ai
sudo systemctl enable pishoo-ai

echo "Deployment complete!"
echo "Pishoo AI should now be accessible at http://${YOUR_DOMAIN}"
echo "Remember to open port 80 and 443 in your firewall if necessary."

