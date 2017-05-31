exit 1;
# not intended to be ran directly, just here for reference

apt-get update
apt-get install mysql-server nginx nodejs npm certbot

mysql_secure_installation

read -s -p 'Enter mysql password for boomerang user:' db_pw

cat <<-EOF | mysql -u root -p
CREATE DATABASE boomerang;
CREATE USER 'boomerang'@'localhost' IDENTIFIED BY '$db_pw';
GRANT SELECT, INSERT, UPDATE, DELETE ON `boomerang`.* TO 'boomerang'@'localhost';
EOF

local_port=29170
domain="db.boomerang-project.com"
repo='https://github.com/jnields/boomerang-project'
npm install --prefix /usr/local/src/ $repo

cat <<-EOF > /etc/nginx/sites-available/default
server {
  listen 80;
  server name ${domain};
  root /var/www/html;
  location /.well-known {
    allow all;
  }
}
EOF

service nginx restart;

certbot --certonly --webroot --webroot-path /var/www/html -d $domain
temp=$(mktemp)
crontab -l > $temp
echo '30  2    *   *   *   /usr/bin/certbot renew -q --post-hook "service nginx reload" >> /var/log/certbot-renew.log' >> $temp
crontab $temp
rm $temp

cat <<-EOF > /etc/nginx/snippets/ssl.conf
#https://mozilla.github.io/server-side-tls/ssl-config-generator/
listen 443 ssl http2;
listen [::]:443 ssl http2;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;


ssl_protocols TLSv1.2;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
ssl_prefer_server_ciphers on;

# HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
add_header Strict-Transport-Security max-age=15768000;

# OCSP Stapling ---
# fetch OCSP records from URL in ssl_certificate and cache them
ssl_stapling on;
ssl_stapling_verify on;
EOF

cat <<-EOF > /etc/nginx/sites-available/default
server {
    listen 80;
    listen [::]:80;
    server_name ${domain};

    root /var/www/html;
    location /.well-known {
        allow all;
    }

    # Redirect all HTTP requests to HTTPS with a 301 Moved Permanently response
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    include /etc/nginx/snippets/ssl.conf;
    server_name $domain;
    # certs sent to the client in SERVER HELLO are concatenated in ssl_certificate
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    location / {
        proxy_pass http://localhost:${local_port};
        proxy_set_header Host \$host;
    }
}
EOF

iptables -A INPUT -p tcp -i lo --dport $local_port -j ACCEPT
iptables -A INPUT -p tcp --dport $local_port -j REJECT

npm i -g pm2
sudo PORT=$local_port pm2 start npm -- start --prefix /usr/local/src/boomerang-project/

service nginx restart
