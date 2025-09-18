FROM linuxserver/webtop:ubuntu-kde

# Preinstall default desktop software + nginx-light for /healthz
USER root
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    libreoffice \
    qpdf ghostscript p7zip-full tesseract-ocr gnome-screenshot \
    nginx-light \
    && rm -rf /var/lib/apt/lists/*

# Optional: install Brave browser (best effort)
RUN curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main" | tee /etc/apt/sources.list.d/brave-browser-release.list \
  && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y brave-browser || true

# Optional: VS Code (best effort)
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/ms_vscode_keyring.gpg \
  && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/ms_vscode_keyring.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list \
  && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y code || true

# Nginx site to serve /healthz (200) and proxy everything else to Webtop on 3001
RUN mkdir -p /etc/nginx/conf.d && \
    printf "server {\n  listen 3000 default_server;\n  server_name _;\n  location = /healthz { return 200 'OK'; add_header Content-Type text/plain; }\n  location / { proxy_pass http://127.0.0.1:3001; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }\n}\n" > /etc/nginx/conf.d/webtop.conf

# s6 service to run nginx in foreground
RUN mkdir -p /etc/services.d/nginx
RUN printf "#!/usr/bin/with-contenv sh\nexec /usr/sbin/nginx -g 'daemon off;'\n" > /etc/services.d/nginx/run && chmod +x /etc/services.d/nginx/run

# Force Webtop internal listen port to 3001 so nginx owns 3000
ENV PORT=3001

EXPOSE 3000

# Webtop uses s6 overlay entrypoint; no CMD override
