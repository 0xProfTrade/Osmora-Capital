# Osmora Capital

Osmora Capital is a full-stack Node.js application with a React frontend, an Express/tRPC server, database-backed contact intake, and direct server-side proposal persistence to Supabase. This README explains how to deploy it to a generic cloud host, Railway, or an aaPanel-managed server.

> **Deployment model:** This is not a static-only site. The Node.js server must remain running because it serves the application and receives form submissions.

## Runtime requirements

| Requirement | Recommended version or setting | Why it matters |
|---|---:|---|
| Node.js | 22 LTS or newer | Matches the project’s current runtime and build tooling. |
| Package manager | pnpm 10 | The repository includes a `pnpm-lock.yaml` file. |
| Process type | Long-running Node.js service | The `start` command serves the built application. |
| Public ports | 80 and 443 | Keep the application port behind a reverse proxy where possible. |
| TLS | Required | Proposal and contact forms collect business and personal information. |

The project scripts are:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
pnpm start
```

The production server uses `PORT` when it is supplied by the host. If it is not defined, it starts from port `3000`.

## Environment variables

Create environment variables in the hosting platform’s secret manager, control panel, or a root-owned environment file. **Never commit these values to Git.**

| Variable | Required for | Notes |
|---|---|---|
| `NODE_ENV` | Production runtime | Set to `production`. |
| `SUPABASE_URL` | Proposal submissions | The project URL for the Supabase instance holding `public.proposals`. |
| `SUPABASE_KEY` | Proposal submissions | Use a server-capable Supabase secret or service-role key. Do **not** use a browser/public key. |
| `DATABASE_URL` | Contact inquiry submissions | Connection string for the application’s MySQL-compatible contact-intake database. |
| `JWT_SECRET` | Existing server session infrastructure | Use a long random value if that infrastructure is retained. |

The `SUPABASE_KEY` is used only on the server. Do not prefix it with `VITE_`, do not add it to browser code, and do not store it in a client-side configuration file. Rotate any credential that may have been pasted into a repository, terminal history, or public issue.

Before deploying, ensure that the Supabase project contains the private `public.proposals` table. The repository includes the migration at [`supabase/migrations/20260820_create_proposals.sql`](supabase/migrations/20260820_create_proposals.sql).

## Generic cloud-host deployment

This path fits most Node-capable cloud platforms and Ubuntu virtual machines. Clone the repository, install dependencies, validate the build, then run the production server.

```bash
git clone https://github.com/0xProfTrade/osmora-capital
cd osmora-capital
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
```

Set the environment variables in the provider’s secure configuration area, then start the service with:

```bash
NODE_ENV=production pnpm start
```

For a virtual machine, use a process manager such as `systemd` so the service restarts after a reboot. Replace `/usr/local/bin/pnpm` with the output of `which pnpm` on the server.

```ini
# /etc/systemd/system/osmora-capital.service
[Unit]
Description=Osmora Capital web application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/srv/osmora-capital
EnvironmentFile=/etc/osmora-capital.env
Environment=NODE_ENV=production
ExecStart=/usr/local/bin/pnpm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Store `/etc/osmora-capital.env` with restrictive permissions:

```bash
sudo chown root:root /etc/osmora-capital.env
sudo chmod 600 /etc/osmora-capital.env
sudo systemctl daemon-reload
sudo systemctl enable --now osmora-capital
sudo systemctl status osmora-capital
```

Place Nginx, Caddy, or the cloud provider’s HTTP gateway in front of the Node.js process. This Nginx example keeps the application bound behind the proxy on port `3000`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After confirming the application responds through Nginx, configure TLS with the certificate solution provided by the host or with Certbot for Nginx.

## Railway deployment

Railway can deploy the application from a connected GitHub repository or with its CLI. Its Node.js/Express guidance supports GitHub, CLI, and Dockerfile deployment paths; this project uses the GitHub route below. [1]

1. Push the project to a **private GitHub repository**. Confirm that `.env` files and database keys are excluded.
2. In Railway, select **New Project** and choose **Deploy from GitHub repo**. Select the repository.
3. In the service’s **Variables** tab, add the required values from the environment-variable table above. Railway makes service variables available during builds and at runtime; keep confidential values sealed where appropriate. [2]
4. Set the service commands if auto-detection does not select them:

   | Setting | Value |
   |---|---|
   | Install command | `pnpm install --frozen-lockfile` |
   | Build command | `pnpm build` |
   | Start command | `pnpm start` |
   | Node environment | `production` |

5. Deploy the service and inspect its logs. The application must finish the build and report that the server is listening.
6. Under **Settings → Networking → Public Networking**, select **Generate Domain** for a temporary public address.
7. For a custom domain, choose **Custom Domain** and create the exact CNAME and TXT records Railway displays. Both records are required for ownership verification; the service then receives TLS automatically after verification. [3]
8. Submit a non-sensitive test proposal and confirm that it appears in the Supabase `public.proposals` table. Remove the test row afterward.

> Railway supplies the `PORT` environment variable at runtime. Do not hardcode a port in the Railway service configuration or application source.

## aaPanel server deployment

aaPanel’s **Node.js Project** feature can manage Node versions, application processes, domain mapping, reverse proxy configuration, SSL, and logs. [4]

### 1. Prepare the server

Install aaPanel, Nginx, and the **Node.js Project** extension. In aaPanel’s Node version manager, install Node.js 22 LTS. Ensure the firewall allows only SSH, HTTP, and HTTPS; do not expose the Node.js application port publicly.

Clone the code into an aaPanel web directory and build it as the application user:

```bash
cd /www/wwwroot
git clone <YOUR_REPOSITORY_URL> osmora-capital
cd osmora-capital
chown -R www:www /www/wwwroot/osmora-capital
sudo -u www corepack enable
sudo -u www corepack prepare pnpm@10.4.1 --activate
sudo -u www pnpm install --frozen-lockfile
sudo -u www pnpm test
sudo -u www pnpm check
sudo -u www pnpm build
```

### 2. Configure secrets

Create a server-side environment file owned by the account that runs the application:

```bash
sudo touch /www/wwwroot/osmora-capital/.env
sudo chown www:www /www/wwwroot/osmora-capital/.env
sudo chmod 600 /www/wwwroot/osmora-capital/.env
```

Add the required values from the environment-variable table. Do not upload the `.env` file to source control or web-accessible directories.

### 3. Add the Node.js project

In aaPanel, open **Website → Node.js Project → Add project** and use:

| Field | Suggested value |
|---|---|
| Path | `/www/wwwroot/osmora-capital` |
| Project name | `osmora-capital` |
| Run option | `start` or the equivalent of `pnpm start` |
| Port | `3000` |
| Run user | `www` |
| Node version | Node.js 22 LTS |
| Domain name | Your production domain |

If the aaPanel interface only exposes `npm` or `yarn`, run dependency installation and the build over SSH with pnpm, then configure the process command as a custom command pointing to the server’s pnpm executable followed by `start`.

### 4. Map the domain and enable TLS

Open the project’s **Domain Manager** or **Mapping** settings. Map the domain to the Node.js project so aaPanel/Nginx forwards requests to `127.0.0.1:3000`. Then issue a certificate from the project’s **SSL** settings and force HTTPS. aaPanel’s mapping option creates a static site entry and reverse-proxies it to the Node.js project; the Node.js Project documentation lists SSL and service controls in the project settings. [4]

### 5. Operate and troubleshoot

Use aaPanel’s project page to start, stop, restart, inspect process status, and view logs. After each code update:

```bash
cd /www/wwwroot/osmora-capital
sudo -u www git pull
sudo -u www pnpm install --frozen-lockfile
sudo -u www pnpm build
```

Restart the project from aaPanel after the build completes. Confirm that the health check, public home page, proposal form, and Supabase record creation all work before considering the deployment complete.

## Production checks

After any deployment, verify the following in order:

1. `pnpm test`, `pnpm check`, and `pnpm build` succeed in the deployment pipeline.
2. The server log confirms the production process is running.
3. The public domain loads over HTTPS and the browser console has no runtime errors.
4. A test proposal produces one record in Supabase; delete the test record afterward.
5. A contact inquiry reaches the configured `DATABASE_URL` datastore.
6. No browser bundle or public repository contains `SUPABASE_KEY`, `DATABASE_URL`, or other secrets.

## References

[1] [Railway — Deploy an Express App](https://docs.railway.com/guides/express)

[2] [Railway — Using Variables](https://docs.railway.com/variables)

[3] [Railway — Working with Domains](https://docs.railway.com/networking/domains/working-with-domains)

[4] [aaPanel — Node.js Project](https://www.aapanel.com/docs/Function/Node.html)
