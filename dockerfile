# Usar Nginx como servidor web
FROM nginx:alpine

# Informacion del proyecto
LABEL proyecto="FerreMax"
LABEL descripcion="Ferreteria virtual"

# Copiar la pagina web al servidor
COPY . /usr/share/nginx/html/

# Puerto del servidor web
EXPOSE 80
