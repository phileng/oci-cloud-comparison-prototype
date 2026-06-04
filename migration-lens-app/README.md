# Migration Lens: OCI, AWS, Azure, and GCP Comparison Prototype

This demo app is the output of a Codex prompt using the **Product Design** plugin.
The workflow started from a supplied architecture diagram showing a layered
application stack:

- Route / Edge / WAF
- Load Balancer
- API / Serverless
- Network
- Web / Containers
- Cache
- Metadata
- Databases

Codex used the Product Design plugin to turn that early architecture concept
into an interactive prototype for comparing cloud services across **Oracle
Cloud Infrastructure (OCI)**, **AWS**, **Microsoft Azure**, and **Google Cloud
Platform (GCP)**.

## What the Prototype Shows

The application presents a migration-focused comparison view for common cloud
architecture layers. It includes:

- A selectable architecture stack based on the original diagram.
- Provider columns for OCI, AWS, Azure, and GCP.
- Representative service mappings by category.
- Migration notes, equivalence labels, confidence indicators, and gap counters.
- Filters for category, workload, environment, region, and compliance context.
- An inspector panel for reviewing migration considerations layer by layer.

The data is a representative seed dataset for prototype discussion. It is not
an authoritative all-services catalog.

## How It Runs

This is a static React/Vite application. The production deployment model is:

```text
React/Vite source
  -> npm run build
  -> dist/ static assets
  -> NGINX container on port 8080
  -> browser-side interactive comparison UI
```

The app has no backend API, database, or server-side session state. The
container serves HTML, CSS, and JavaScript only.

## Local Development

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
```

## Local Docker Demo

```bash
docker build -t migration-lens-app:local .
docker run --rm --name migration-lens-demo -p 8080:8080 migration-lens-app:local
```

Then open:

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

## Deployment Documentation

The OCI deployment runbook is available at:

```text
docs/oci-tenant-deployment-guide.html
```

That guide documents OCI CLI deployment to tenant `phieng2345`, Security
Central readiness preparation, GitHub repository setup, operations commands,
and an appendix explaining how the prototype works in the OCI deployment.

## Key Files

- `src/App.jsx`: interactive prototype behavior and representative cloud service mappings.
- `src/styles.css`: prototype layout and visual styling.
- `Dockerfile`: multi-stage static build and NGINX runtime image.
- `nginx.conf`: static file serving, SPA fallback, and `/healthz`.
- `docs/oci-tenant-deployment-guide.html`: self-contained OCI deployment guide.
- `deploy/`: deployment notes and OCI-oriented runbook support files.

## Provenance

This repository is intended to preserve the output of the Codex + Product
Design plugin workflow: starting with an architecture diagram, exploring visual
directions, and implementing a reviewable prototype demo app for cloud
comparison and migration planning.
