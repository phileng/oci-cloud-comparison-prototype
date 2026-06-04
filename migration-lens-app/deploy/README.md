# Deployment Artifacts

This folder contains deployment paths for the Migration Lens prototype:

- `oci-container-instance/README.md`: containerized deployment through OCI Container Instances.
- `oci-container-instance/deployment-values.example.env`: placeholder values for OCIR tagging and OCI deployment.
- `object-storage-api-gateway/README.md`: static-site deployment option for the built Vite `dist/` output.

The default container image listens on port `8080` and exposes `/healthz`.
