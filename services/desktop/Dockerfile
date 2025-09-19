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

# Ensure Webtop binds internally on 3001
ENV CUSTOM_PORT=3001

# Nginx base config template (rendered at runtime with $PORT)
COPY nginx/nginx.conf.tmpl /etc/nginx/nginx.conf.tmpl

# Nginx per-route config fragments
COPY nginx/conf.d/ /etc/nginx/conf.d/


# s6 (v3) nginx service (longrun)
RUN mkdir -p /etc/s6-overlay/s6-rc.d/user/contents.d /etc/s6-overlay/s6-rc.d/nginx /etc/s6-overlay/s6-rc.d/nginx/dependencies.d
COPY s6-overlay/s6-rc.d/nginx /etc/s6-overlay/s6-rc.d/nginx
# Normalize line endings to LF to satisfy s6-rc and shell
RUN sed -i 's/\r$//' /etc/s6-overlay/s6-rc.d/nginx/type /etc/s6-overlay/s6-rc.d/nginx/run \
    && sed -i 's/\r$//' /etc/nginx/nginx.conf.tmpl /etc/nginx/conf.d/healthz.conf /etc/nginx/conf.d/proxy.conf \
    && chmod +x /etc/s6-overlay/s6-rc.d/nginx/run
RUN touch /etc/s6-overlay/s6-rc.d/nginx/dependencies.d/base
RUN touch /etc/s6-overlay/s6-rc.d/user/contents.d/nginx

# Webtop uses s6 overlay entrypoint; no CMD override
