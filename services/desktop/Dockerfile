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

# cont-init script to prepare nginx front and env
COPY cont-init/10-portfix /etc/cont-init.d/10-portfix

# Nginx front template (rendered at runtime with $NGINX_PORT)
COPY nginx/conf.d/front.conf.tmpl /etc/nginx/conf.d/front.conf.tmpl

# Normalize line endings to LF to satisfy s6-rc and shell
RUN sed -i 's/\r$//' /etc/nginx/conf.d/front.conf.tmpl \
    && sed -i 's/\r$//' /etc/cont-init.d/10-portfix \
    && chmod +x /etc/cont-init.d/10-portfix

# Webtop uses s6 overlay entrypoint; no CMD override
