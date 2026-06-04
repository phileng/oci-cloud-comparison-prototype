# Object Storage + API Gateway Static Deployment

This path deploys the Vite build output as static content without running a container.

## Official Reference

- OCI API Gateway static web hosting tutorial: https://docs.oracle.com/en/learn/oci-api-gateway-web-hosting/index.html

## Build Output

From `/Users/pheng/Codex/oci-cloud-comparison-prototype/migration-lens-app`:

```bash
npm ci
npm run build
```

Upload the contents of:

```text
/Users/pheng/Codex/oci-cloud-comparison-prototype/migration-lens-app/dist
```

to the target Object Storage bucket.

## Recommended Shape

- Object Storage bucket: stores the static files from `dist/`.
- API Gateway: exposes HTTPS routes to the uploaded static content.
- Optional WAF: place in front if the prototype is internet-facing.
- Optional IAM/network controls: restrict access for internal review.

## Verification

After publishing, verify:

```bash
curl -I https://<api-gateway-hostname>/
curl https://<api-gateway-hostname>/ | head
```

Then validate navigation in a browser, including refresh on deep links. The container path already includes SPA fallback in NGINX; the Object Storage/API Gateway path needs equivalent routing behavior configured at the gateway layer.
