FROM linuxserver/webtop:ubuntu-kde

# Preinstall default desktop software + nginx-light for /healthz
USER root
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    libreoffice \
    qpdf ghostscript p7zip-full tesseract-ocr gnome-screenshot \
    nginx-light gettext-base \
    && rm -rf /var/lib/apt/lists/*

# Optional: install Brave browser (best effort)
RUN curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main" | tee /etc/apt/sources.list.d/brave-browser-release.list \
  && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y brave-browser || true

# Optional: VS Code (best effort)
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/ms_vscode_keyring.gpg \
  && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/ms_vscode_keyring.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list \
  && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y code || true

# Nginx base config to include our conf.d files
RUN sh -lc "cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  access_log  /var/log/nginx/access.log  combined;
  sendfile        on;
  keepalive_timeout  65;
  include /etc/nginx/conf.d/*.conf;
}
EOF"

# Nginx site to serve /healthz (200) and proxy everything else to Webtop on 3001
RUN mkdir -p /etc/nginx/conf.d && sh -lc "cat > /etc/nginx/conf.d/webtop.conf.tmpl << 'EOF'
server {
  listen ${PORT} default_server;
  server_name _;
  location = /healthz { return 200 'OK'; add_header Content-Type text/plain; }
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
EOF"

# s6 cont-init to move webtop to 3001 to avoid port conflict with nginx
RUN sh -lc "cat > /etc/cont-init.d/10-portfix << 'EOF'
#!/usr/bin/with-contenv sh
if [ -d /etc/services.d ]; then
  for f in /etc/services.d/*/run; do
    if [ -f \"$f\" ]; then
      sed -i -e 's/:3000/:3001/g' -e 's/:\\$PORT/:3001/g' \"$f\" || true
    fi
  done
fi
EOF
chmod +x /etc/cont-init.d/10-portfix"

# s6 (v3-compatible) service to render nginx conf with $PORT and run in foreground
RUN mkdir -p /etc/s6-overlay/s6-rc.d/nginx /etc/s6-overlay/s6-rc.d/user/contents.d
RUN sh -lc "printf 'longrun\n' > /etc/s6-overlay/s6-rc.d/nginx/type"
RUN sh -lc "cat > /etc/s6-overlay/s6-rc.d/nginx/run << 'EOF'
#!/usr/bin/with-contenv sh
# Use PORT provided by the platform at runtime, default to 3000 if unset
: \"${PORT:=3000}\"
# Ensure nginx runtime dir exists and disable default site that may bind to :80
mkdir -p /run/nginx || true
rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default 2>/dev/null || true
# Only substitute PORT to preserve nginx variables like $host
/usr/bin/envsubst '\$PORT' < /etc/nginx/conf.d/webtop.conf.tmpl > /etc/nginx/conf.d/webtop.conf
exec /usr/sbin/nginx -g 'daemon off;'
EOF
chmod +x /etc/s6-overlay/s6-rc.d/nginx/run && touch /etc/s6-overlay/s6-rc.d/user/contents.d/nginx"

EXPOSE 3000

# Webtop uses s6 overlay entrypoint; no CMD override
