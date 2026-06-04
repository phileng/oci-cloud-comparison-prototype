# OCI Cloud Comparison Prototype

GitHub repository:

https://github.com/phileng/oci-cloud-comparison-prototype

This repository contains the Migration Lens prototype generated from a Codex
prompt using the Product Design plugin. The prompt started with a layered cloud
architecture diagram and produced an interactive demo app comparing OCI, AWS,
Azure, and GCP services for migration planning.

The deployable app lives in:

```text
migration-lens-app/
```

Use that folder as the project root for local development, container builds,
and OCI deployment artifacts.

## Fresh Install

Clone the repository:

```bash
git clone https://github.com/phileng/oci-cloud-comparison-prototype.git
cd oci-cloud-comparison-prototype/migration-lens-app
```

Install dependencies:

```bash
npm ci
```

Run the local Vite development server:

```bash
npm run dev
```

Build the production static bundle:

```bash
npm run build
```

Run the production-style local Docker demo:

```bash
docker build -t migration-lens-app:local .
docker run --rm --name migration-lens-demo -p 8080:8080 migration-lens-app:local
```

Open:

```text
http://127.0.0.1:8080/
```

Health check:

```bash
curl http://127.0.0.1:8080/healthz
```

Expected response:

```text
ok
```

## Documentation

- App README: `migration-lens-app/README.md`
- OCI deployment guide: `migration-lens-app/docs/oci-tenant-deployment-guide.html`
- OCI deployment support files: `migration-lens-app/deploy/`

## Notes

- The prototype uses representative seed data and is not an authoritative
  all-services cloud catalog.
- Do not commit OCI auth tokens, private keys, generated deployment values, or
  tenant-specific secret material.
