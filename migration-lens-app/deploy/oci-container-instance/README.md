# OCI Container Instance Deployment

This path packages the React/Vite prototype as a static NGINX container for OCI Container Instances.

## Files

- `Dockerfile`: multi-stage build. Node builds the Vite app; NGINX serves the generated static files.
- `nginx.conf`: SPA fallback, immutable asset cache headers, and `/healthz`.
- `compose.yaml`: local container smoke test.
- `deployment-values.example.env`: placeholders for OCIR image naming and OCI resource IDs.

## Official References

- OCI Container Instances overview: https://docs.oracle.com/en-us/iaas/Content/container-instances/overview-of-container-instances.htm
- Create a container instance: https://docs.oracle.com/en-us/iaas/Content/container-instances/creating-a-container-instance.htm
- Push images to OCI Container Registry: https://docs.oracle.com/en-us/iaas/Content/Registry/Tasks/registrypushingimagesusingthedockercli.htm

## Local Validation

From `/Users/pheng/Codex/oci-cloud-comparison-prototype/migration-lens-app`:

```bash
npm ci
npm run build
docker build -t migration-lens-app:local .
docker run --rm -p 8080:8080 migration-lens-app:local
curl http://127.0.0.1:8080/healthz
```

Or use Compose:

```bash
docker compose up --build
```

## OCIR Image Push

Prepare values:

```bash
cd /Users/pheng/Codex/oci-cloud-comparison-prototype/migration-lens-app
cp deploy/oci-container-instance/deployment-values.example.env deploy/oci-container-instance/deployment-values.env
source deploy/oci-container-instance/deployment-values.env
```

Build, tag, and push:

```bash
docker build -t migration-lens-app:${IMAGE_TAG} .
docker tag migration-lens-app:${IMAGE_TAG} ${IMAGE_NAME}
docker login ${OCI_REGION_KEY}.ocir.io
docker push ${IMAGE_NAME}
```

Use an OCI auth token as the Docker Registry password. Confirm the exact Docker login username format for your tenancy identity type in the OCIR documentation before pushing.

## Container Instance Setup

Create the OCI Container Instance with these settings:

- Compartment: `${OCI_COMPARTMENT_OCID}`
- Image: `${IMAGE_NAME}`
- Container port: `8080`
- Health path: `/healthz`
- Shape: start small for this static prototype, then tune OCPU and memory after load testing.
- Networking: VCN/subnet with a security list or network security group allowing inbound TCP `8080` from the intended client CIDR.

For an internal review prototype, prefer a private subnet plus VPN, bastion, private load balancer, or API Gateway in front. For a public prototype, restrict ingress to the smallest practical source CIDR and avoid embedding sensitive data in the static bundle.

## Post-Deployment Verification

```bash
curl http://<container-instance-public-or-private-ip>:8080/healthz
curl -I http://<container-instance-public-or-private-ip>:8080/
```

Then open:

```text
http://<container-instance-public-or-private-ip>:8080/
```

## Notes

- This prototype is static frontend content. Container Instances is appropriate when the team wants the same container packaging model that will later host API backends or internal review services.
- If the UI remains static, the Object Storage plus API Gateway path in `../object-storage-api-gateway/README.md` is usually simpler to operate.
