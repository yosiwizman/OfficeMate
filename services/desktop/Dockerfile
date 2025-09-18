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
RUN sh -lc "cat > /etc/nginx/nginx.conf << 'EOF'\nuser www-data;\nworker_processes auto;\nerror_log /var/log/nginx/error.log warn;\npid /run/nginx.pid;\n\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  include       /etc/nginx/mime.types;\n  default_type  application/octet-stream;\n  access_log  /var/log/nginx/access.log  combined;\n  sendfile        on;\n  keepalive_timeout  65;\n  include /etc/nginx/conf.d/*.conf;\n}\nEOF"

# Nginx site to serve /healthz (200) and proxy everything else to Webtop on 3001
RUN mkdir -p /etc/nginx/conf.d && sh -lc "cat > /etc/nginx/conf.d/webtop.conf.tmpl << 'EOF'\nserver {\n  listen ${PORT} default_server;\n  server_name _;\n  location = /healthz { return 200 'OK'; add_header Content-Type text/plain; }\n  location / {\n    proxy_pass http://127.0.0.1:3001;\n    proxy_set_header Host $host;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n  }\n}\nEOF"

# s6 cont-init to move webtop to 3001 to avoid port conflict with nginx
RUN sh -lc "cat > /etc/cont-init.d/10-portfix << 'EOF'\n#!/usr/bin/with-contenv sh\nif [ -d /etc/services.d ]; then\n  for f in /etc/services.d/*/run; do\n    if [ -f \"$f\" ]; then\n      sed -i -e 's/:3000/:3001/g' -e 's/:\\$PORT/:3001/g' \"$f\" || true\n    fi\n  done\nfi\nEOF\nchmod +x /etc/cont-init.d/10-portfix"

# s6 service to render nginx conf with $PORT and run in foreground
RUN mkdir -p /etc/services.d/nginx
RUN sh -lc "cat > /etc/services.d/nginx/run << 'EOF'\n#!/usr/bin/with-contenv sh\n# Use PORT provided by the platform at runtime, default to 3000 if unset\n: \"${PORT:=3000}\"\n# Ensure nginx runtime dir exists and disable default site that may bind to :80\nmkdir -p /run/nginx || true\nrm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default 2>/dev/null || true\n# Only substitute PORT to preserve nginx variables like $host\n/usr/bin/envsubst '\$PORT' < /etc/nginx/conf.d/webtop.conf.tmpl > /etc/nginx/conf.d/webtop.conf\nexec /usr/sbin/nginx -g 'daemon off;'\nEOF\nchmod +x /etc/services.d/nginx/run"

EXPOSE 3000

# Webtop uses s6 overlay entrypoint; no CMD override
