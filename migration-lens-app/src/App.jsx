import { useMemo, useState } from "react";

const providers = [
  {
    key: "oci",
    name: "OCI",
    label: "ORACLE Cloud",
    accent: "#d44832",
    source: "https://docs.oracle.com/iaas/Content/services.htm",
  },
  {
    key: "aws",
    name: "AWS",
    label: "Amazon Web Services",
    accent: "#ff9900",
    source: "https://aws.amazon.com/products/",
  },
  {
    key: "azure",
    name: "Azure",
    label: "Microsoft Azure",
    accent: "#0078d4",
    source: "https://azure.microsoft.com/en-us/services/",
  },
  {
    key: "gcp",
    name: "GCP",
    label: "Google Cloud",
    accent: "#4285f4",
    source: "https://docs.cloud.google.com/docs/product-list",
  },
];

const categories = [
  "All Categories",
  "Compute",
  "Storage",
  "Networking",
  "Database",
  "AI/ML",
  "Analytics",
  "Security",
  "DevOps",
  "Observability",
  "Integration",
  "Governance",
];

const mappings = [
  {
    id: "route",
    order: 1,
    layer: "Route",
    layerNote: "Edge + WAF",
    category: "Networking",
    impact: 34,
    confidence: 92,
    gap: { critical: 1, high: 2, medium: 3, review: 0 },
    migration: "DNS and WAF migrations usually have low platform lock-in, but require careful rule translation and phased cutover.",
    services: {
      oci: [
        ["OCI DNS", "Managed DNS zones and records", "Equivalent"],
        ["OCI Web Application Firewall", "Edge WAF policy enforcement", "Close"],
      ],
      aws: [
        ["Amazon Route 53", "Managed DNS and routing", "Equivalent"],
        ["AWS WAF", "Application firewall rules", "Close"],
      ],
      azure: [
        ["Azure DNS", "Managed DNS zones and records", "Equivalent"],
        ["Azure Web Application Firewall", "WAF with Application Gateway or Front Door", "Close"],
      ],
      gcp: [
        ["Cloud DNS", "Managed DNS zones and records", "Equivalent"],
        ["Google Cloud Armor", "DDoS protection and WAF", "Close"],
      ],
    },
  },
  {
    id: "load-balancer",
    order: 2,
    layer: "Load Balancer",
    layerNote: "Traffic distribution",
    category: "Networking",
    impact: 42,
    confidence: 88,
    gap: { critical: 0, high: 2, medium: 4, review: 1 },
    migration: "Layer 4, Layer 7, TLS policy, health check, and regional/global behavior should be compared before migration.",
    services: {
      oci: [["OCI Load Balancer", "Public and private load balancing", "Equivalent"]],
      aws: [["Elastic Load Balancing", "ALB, NLB, GLB patterns", "Equivalent"]],
      azure: [
        ["Azure Load Balancer", "Layer 4 load balancing", "Equivalent"],
        ["Application Gateway", "Layer 7 routing and WAF option", "Close"],
      ],
      gcp: [["Cloud Load Balancing", "Global and regional load balancing", "Equivalent"]],
    },
  },
  {
    id: "api-serverless",
    order: 3,
    layer: "API (Serverless)",
    layerNote: "Application logic",
    category: "Integration",
    impact: 58,
    confidence: 81,
    gap: { critical: 2, high: 3, medium: 4, review: 2 },
    migration: "API policy, identity propagation, event shape, cold start behavior, and deployment pipelines drive the main differences.",
    services: {
      oci: [
        ["OCI API Gateway", "Managed API front door", "Close"],
        ["OCI Functions", "Serverless functions", "Equivalent"],
      ],
      aws: [
        ["Amazon API Gateway", "Managed API front door", "Close"],
        ["AWS Lambda", "Serverless functions", "Equivalent"],
      ],
      azure: [
        ["Azure API Management", "API gateway and lifecycle", "Partial"],
        ["Azure Functions", "Serverless functions", "Equivalent"],
      ],
      gcp: [
        ["API Gateway", "Managed API front door", "Partial"],
        ["Cloud Functions", "Serverless functions", "Equivalent"],
        ["Cloud Run", "Serverless containers", "Close"],
      ],
    },
  },
  {
    id: "network",
    order: 4,
    layer: "Network",
    layerNote: "Connectivity",
    category: "Networking",
    impact: 51,
    confidence: 86,
    gap: { critical: 1, high: 3, medium: 4, review: 2 },
    migration: "CIDR strategy, route tables, peering, DNS resolution, network security, and private endpoint patterns need direct mapping.",
    services: {
      oci: [["OCI Virtual Cloud Network", "Software-defined cloud network", "Equivalent"]],
      aws: [["Amazon VPC", "Software-defined cloud network", "Equivalent"]],
      azure: [["Azure Virtual Network", "Software-defined cloud network", "Equivalent"]],
      gcp: [["Virtual Private Cloud", "Software-defined cloud network", "Equivalent"]],
    },
  },
  {
    id: "containers",
    order: 5,
    layer: "Web (Containers)",
    layerNote: "Application tier",
    category: "Compute",
    impact: 63,
    confidence: 78,
    gap: { critical: 2, high: 4, medium: 6, review: 2 },
    migration: "Kubernetes runtime, ingress, identity, registry, node image, autoscaling, and service mesh choices affect portability.",
    services: {
      oci: [
        ["OCI Container Engine for Kubernetes", "Managed Kubernetes", "Equivalent"],
        ["OCI Container Instances", "Serverless container instances", "Partial"],
      ],
      aws: [
        ["Amazon EKS", "Managed Kubernetes", "Equivalent"],
        ["Amazon ECS with Fargate", "Managed containers without servers", "Close"],
      ],
      azure: [
        ["Azure Kubernetes Service", "Managed Kubernetes", "Equivalent"],
        ["Azure Container Apps", "Serverless container apps", "Close"],
      ],
      gcp: [
        ["Google Kubernetes Engine", "Managed Kubernetes", "Equivalent"],
        ["Cloud Run", "Serverless containers", "Close"],
      ],
    },
  },
  {
    id: "hybrid-connectivity",
    order: 6,
    layer: "Network",
    layerNote: "Hybrid connectivity",
    category: "Networking",
    impact: 67,
    confidence: 74,
    gap: { critical: 2, high: 5, medium: 4, review: 3 },
    migration: "Private connectivity is strongly topology-dependent; edge locations, BGP policy, throughput, and HA design vary by provider.",
    services: {
      oci: [
        ["FastConnect", "Private dedicated connectivity", "Equivalent"],
        ["Dynamic Routing Gateway", "Hub for VCN connectivity", "Close"],
      ],
      aws: [
        ["AWS Direct Connect", "Private dedicated connectivity", "Equivalent"],
        ["AWS Transit Gateway", "Hub for VPC connectivity", "Close"],
      ],
      azure: [
        ["ExpressRoute", "Private dedicated connectivity", "Equivalent"],
        ["Azure Virtual WAN", "Global transit networking", "Close"],
      ],
      gcp: [
        ["Cloud Interconnect", "Private dedicated connectivity", "Equivalent"],
        ["Network Connectivity Center", "Hub for hybrid connectivity", "Close"],
      ],
    },
  },
  {
    id: "cache",
    order: 7,
    layer: "Cache",
    layerNote: "Data cache",
    category: "Database",
    impact: 39,
    confidence: 85,
    gap: { critical: 0, high: 2, medium: 3, review: 1 },
    migration: "Engine compatibility, clustering model, persistence, failover, and client libraries are the key checks.",
    services: {
      oci: [["OCI Cache", "Managed Redis-compatible caching", "Equivalent"]],
      aws: [["Amazon ElastiCache", "Managed Redis or Memcached", "Equivalent"]],
      azure: [["Azure Cache for Redis", "Managed Redis cache", "Equivalent"]],
      gcp: [["Memorystore", "Managed Redis or Memcached", "Equivalent"]],
    },
  },
  {
    id: "metadata",
    order: 8,
    layer: "Metadata",
    layerNote: "Object storage",
    category: "Storage",
    impact: 45,
    confidence: 83,
    gap: { critical: 1, high: 2, medium: 4, review: 1 },
    migration: "Object metadata, lifecycle rules, event notifications, IAM, replication, and object lock semantics should be reviewed.",
    services: {
      oci: [["OCI Object Storage", "Durable object storage", "Equivalent"]],
      aws: [["Amazon S3", "Durable object storage", "Equivalent"]],
      azure: [["Azure Blob Storage", "Massively scalable object storage", "Equivalent"]],
      gcp: [["Cloud Storage", "Multi-class object storage", "Equivalent"]],
    },
  },
  {
    id: "databases",
    order: 9,
    layer: "Databases",
    layerNote: "Persistent data",
    category: "Database",
    impact: 72,
    confidence: 69,
    gap: { critical: 3, high: 5, medium: 4, review: 4 },
    migration: "Database mappings are rarely one-to-one; engine compatibility, managed operations, licensing, HA, backup, and data movement dominate.",
    services: {
      oci: [
        ["Autonomous Database", "Managed Oracle database", "Close"],
        ["Base Database Service", "Managed Oracle database systems", "Close"],
      ],
      aws: [
        ["Amazon RDS", "Managed relational database engines", "Partial"],
        ["Amazon Aurora", "Cloud-native relational database", "Partial"],
      ],
      azure: [
        ["Azure SQL Database", "Managed SQL database", "Partial"],
        ["Azure Database services", "Managed open-source databases", "Partial"],
      ],
      gcp: [
        ["Cloud SQL", "Managed relational databases", "Partial"],
        ["AlloyDB", "Managed PostgreSQL-compatible database", "Partial"],
        ["Spanner", "Globally distributed relational database", "Partial"],
      ],
    },
  },
  {
    id: "compute",
    order: 10,
    layer: "Compute",
    layerNote: "Virtual machines",
    category: "Compute",
    impact: 49,
    confidence: 86,
    gap: { critical: 1, high: 3, medium: 3, review: 1 },
    migration: "Instance families, shape flexibility, images, networking throughput, and licensing terms should be compared per workload.",
    services: {
      oci: [["OCI Compute", "Virtual machine and bare metal instances", "Equivalent"]],
      aws: [["Amazon EC2", "Resizable compute capacity", "Equivalent"]],
      azure: [["Azure Virtual Machines", "Windows and Linux VMs", "Equivalent"]],
      gcp: [["Compute Engine", "VMs, GPUs, TPUs, and disks", "Equivalent"]],
    },
  },
  {
    id: "security-iam",
    order: 11,
    layer: "IAM",
    layerNote: "Identity and access",
    category: "Security",
    impact: 76,
    confidence: 64,
    gap: { critical: 4, high: 6, medium: 3, review: 5 },
    migration: "Identity policy languages, tenancy models, groups, roles, conditional access, and federation differ materially by provider.",
    services: {
      oci: [
        ["OCI IAM", "Identity domains, users, groups, policies", "Partial"],
        ["OCI Vault", "Keys and secrets", "Close"],
      ],
      aws: [
        ["AWS Identity and Access Management", "Users, roles, and policies", "Partial"],
        ["AWS KMS", "Managed key service", "Close"],
      ],
      azure: [
        ["Microsoft Entra ID", "Identity and access platform", "Partial"],
        ["Azure Key Vault", "Keys, secrets, certificates", "Close"],
      ],
      gcp: [
        ["Cloud IAM", "Resource access control", "Partial"],
        ["Cloud KMS", "Hosted key management", "Close"],
      ],
    },
  },
  {
    id: "observability",
    order: 12,
    layer: "Observability",
    layerNote: "Logs and metrics",
    category: "Observability",
    impact: 43,
    confidence: 80,
    gap: { critical: 0, high: 2, medium: 5, review: 2 },
    migration: "Metric namespaces, log query language, retention, alerting, and exporter compatibility affect portability.",
    services: {
      oci: [["OCI Monitoring and Logging", "Metrics, alarms, logs, and analytics", "Close"]],
      aws: [["Amazon CloudWatch", "Metrics, logs, alarms, and events", "Close"]],
      azure: [["Azure Monitor", "Metrics, logs, alerts, and insights", "Close"]],
      gcp: [["Cloud Monitoring and Cloud Logging", "Metrics, logs, and alerting", "Close"]],
    },
  },
  {
    id: "analytics",
    order: 13,
    layer: "Analytics",
    layerNote: "Data platforms",
    category: "Analytics",
    impact: 70,
    confidence: 62,
    gap: { critical: 3, high: 5, medium: 6, review: 3 },
    migration: "Warehouse engines, Spark runtimes, governance catalogs, ingestion, and BI integrations make analytics highly workload-specific.",
    services: {
      oci: [
        ["Oracle Analytics Cloud", "Analytics and BI", "Partial"],
        ["OCI Data Flow", "Managed Spark", "Close"],
      ],
      aws: [
        ["Amazon Redshift", "Cloud data warehouse", "Partial"],
        ["AWS Glue", "Data integration and catalog", "Close"],
      ],
      azure: [
        ["Azure Synapse Analytics", "Analytics workspace", "Partial"],
        ["Azure Data Factory", "Data integration", "Close"],
      ],
      gcp: [
        ["BigQuery", "Serverless data warehouse", "Partial"],
        ["Dataflow", "Stream and batch processing", "Close"],
      ],
    },
  },
  {
    id: "aiml",
    order: 14,
    layer: "AI/ML",
    layerNote: "Model platforms",
    category: "AI/ML",
    impact: 74,
    confidence: 58,
    gap: { critical: 4, high: 6, medium: 7, review: 5 },
    migration: "Model hosting, vector search, foundation model access, data governance, and accelerator availability are fast-moving and provider-specific.",
    services: {
      oci: [
        ["OCI Data Science", "ML lifecycle platform", "Close"],
        ["OCI Generative AI", "Foundation model service", "Partial"],
      ],
      aws: [
        ["Amazon SageMaker AI", "ML lifecycle platform", "Close"],
        ["Amazon Bedrock", "Foundation model service", "Partial"],
      ],
      azure: [
        ["Azure Machine Learning", "ML lifecycle platform", "Close"],
        ["Azure AI Foundry", "Generative AI app platform", "Partial"],
      ],
      gcp: [["Vertex AI", "Unified ML and generative AI platform", "Close"]],
    },
  },
  {
    id: "devops",
    order: 15,
    layer: "DevOps",
    layerNote: "Delivery and IaC",
    category: "DevOps",
    impact: 55,
    confidence: 71,
    gap: { critical: 1, high: 4, medium: 5, review: 2 },
    migration: "Pipeline migration depends on source control, artifact stores, IaC language, secrets, approvals, and deployment targets.",
    services: {
      oci: [
        ["OCI DevOps", "Build and deployment pipelines", "Close"],
        ["Resource Manager", "Terraform-based resource provisioning", "Close"],
      ],
      aws: [
        ["AWS CodePipeline", "Release automation", "Close"],
        ["AWS CloudFormation", "Infrastructure as code", "Partial"],
      ],
      azure: [
        ["Azure DevOps", "Boards, repos, pipelines, artifacts", "Close"],
        ["ARM and Bicep", "Infrastructure as code", "Partial"],
      ],
      gcp: [
        ["Cloud Build", "Build and delivery automation", "Close"],
        ["Infra Manager", "Terraform-based resource provisioning", "Close"],
      ],
    },
  },
  {
    id: "governance",
    order: 16,
    layer: "Governance",
    layerNote: "Risk and posture",
    category: "Governance",
    impact: 66,
    confidence: 67,
    gap: { critical: 2, high: 5, medium: 5, review: 4 },
    migration: "Governance equivalence is policy-driven: inventory, posture management, compliance reporting, quotas, tagging, and organizational hierarchy vary.",
    services: {
      oci: [
        ["Cloud Guard", "Cloud security posture management", "Close"],
        ["Tagging", "Resource metadata and controls", "Equivalent"],
      ],
      aws: [
        ["AWS Config", "Resource configuration tracking", "Close"],
        ["AWS Organizations", "Account governance", "Partial"],
      ],
      azure: [
        ["Azure Policy", "Policy and compliance controls", "Close"],
        ["Microsoft Defender for Cloud", "Posture and workload protection", "Close"],
      ],
      gcp: [
        ["Security Command Center", "Security and risk management", "Close"],
        ["Cloud Asset Inventory", "Asset inventory and search", "Close"],
      ],
    },
  },
];

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function getCategoryCounts() {
  return categories.reduce((acc, category) => {
    if (category === "All Categories") {
      acc[category] = mappings.length;
    } else {
      acc[category] = mappings.filter((mapping) => mapping.category === category).length;
    }
    return acc;
  }, {});
}

function serviceSearchText(mapping) {
  return [
    mapping.layer,
    mapping.layerNote,
    mapping.category,
    mapping.migration,
    ...providers.flatMap((provider) =>
      mapping.services[provider.key].flatMap(([name, desc, status]) => [name, desc, status]),
    ),
  ]
    .join(" ")
    .toLowerCase();
}

function TopBar({
  search,
  setSearch,
  preset,
  setPreset,
  comparison,
  setComparison,
  drawerOpen,
  setDrawerOpen,
}) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <span className="brand-mark">ML</span>
        <div>
          <strong>Migration Lens</strong>
          <span>OCI to AWS, Azure, and GCP service comparison</span>
        </div>
      </div>

      <label className="global-search">
        <span>Search</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services, layers, capabilities..."
        />
      </label>

      <label className="select-control">
        <span>Architecture preset</span>
        <select value={preset} onChange={(event) => setPreset(event.target.value)}>
          <option>Standard Web Application</option>
          <option>Data Platform</option>
          <option>AI Application</option>
          <option>Regulated Enterprise</option>
        </select>
      </label>

      <label className="select-control">
        <span>Saved comparison</span>
        <select value={comparison} onChange={(event) => setComparison(event.target.value)}>
          <option>Prod Web App v2</option>
          <option>Container modernization</option>
          <option>Security baseline</option>
        </select>
      </label>

      <button className="utility-button" onClick={() => setDrawerOpen(!drawerOpen)}>
        {drawerOpen ? "Close inspector" : "Inspect layer"}
      </button>
    </header>
  );
}

function Sidebar({
  category,
  setCategory,
  region,
  setRegion,
  workload,
  setWorkload,
  environment,
  setEnvironment,
  compliance,
  setCompliance,
  showDeprecated,
  setShowDeprecated,
}) {
  const counts = getCategoryCounts();

  return (
    <aside className="sidebar">
      <div className="side-section">
        <p className="side-label">Compare by category</p>
        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={item === category ? "category active" : "category"}
              onClick={() => setCategory(item)}
            >
              <span>{item}</span>
              <b>{counts[item]}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="side-section filter-panel">
        <div className="filter-heading">
          <p className="side-label">Filters</p>
          <button
            onClick={() => {
              setRegion("US East");
              setWorkload("Web Application");
              setEnvironment("Production");
              setCompliance("SOC 2, ISO 27001");
              setShowDeprecated(false);
            }}
          >
            Clear all
          </button>
        </div>
        <label>
          Region
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>US East</option>
            <option>US West</option>
            <option>Europe</option>
            <option>Global services</option>
          </select>
        </label>
        <label>
          Workload type
          <select value={workload} onChange={(event) => setWorkload(event.target.value)}>
            <option>Web Application</option>
            <option>Analytics</option>
            <option>AI Application</option>
            <option>Hybrid Network</option>
          </select>
        </label>
        <label>
          Environment
          <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
            <option>Production</option>
            <option>Pre-production</option>
            <option>Development</option>
          </select>
        </label>
        <label>
          Compliance
          <select value={compliance} onChange={(event) => setCompliance(event.target.value)}>
            <option>SOC 2, ISO 27001</option>
            <option>PCI DSS</option>
            <option>HIPAA review</option>
            <option>FedRAMP review</option>
          </select>
        </label>
        <label className="toggle-row">
          Show deprecated
          <input
            type="checkbox"
            checked={showDeprecated}
            onChange={(event) => setShowDeprecated(event.target.checked)}
          />
        </label>
      </div>

      <button className="preferences">Manage preferences</button>
    </aside>
  );
}

function ArchitectureStack({ rows, selectedId, onSelect }) {
  return (
    <section className="stack-panel" aria-label="Architecture stack">
      <div className="stack-title">
        <span>Architecture</span>
        <b>{rows.length} visible layers</b>
      </div>
      <div className="stack-flow">
        {rows.map((mapping) => (
          <button
            key={mapping.id}
            className={mapping.id === selectedId ? "stack-node active" : "stack-node"}
            onClick={() => onSelect(mapping.id)}
          >
            <span className="node-index">{mapping.order}</span>
            <span>
              <strong>{mapping.layer}</strong>
              <small>{mapping.layerNote}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ mapping, provider, selected, onSelect, showGaps }) {
  const services = mapping.services[provider.key];
  const primaryStatus = services[0][2];

  return (
    <button className={selected ? "service-card selected" : "service-card"} onClick={onSelect}>
      <div className="service-card-head">
        <span className="layer-mini">{mapping.order}</span>
        <div>
          <strong>{mapping.layer}</strong>
          <small>{mapping.category}</small>
        </div>
        <em className={`status-pill ${getStatusClass(primaryStatus)}`}>{primaryStatus}</em>
      </div>
      <div className="service-list">
        {services.slice(0, 3).map(([name, desc, status]) => (
          <div key={`${provider.key}-${mapping.id}-${name}`} className="service-line">
            <span className="service-name">{name}</span>
            <span className="service-desc">{desc}</span>
            <i className={`service-status ${getStatusClass(status)}`}>{status}</i>
          </div>
        ))}
      </div>
      {showGaps && (
        <div className="gap-strip">
          <span style={{ width: `${Math.max(mapping.gap.critical * 9, 4)}%` }} />
          <span style={{ width: `${Math.max(mapping.gap.high * 8, 6)}%` }} />
          <span style={{ width: `${Math.max(mapping.gap.medium * 7, 8)}%` }} />
        </div>
      )}
    </button>
  );
}

function ProviderColumn({ provider, rows, selectedId, onSelect, showGaps }) {
  const [expanded, setExpanded] = useState(false);
  const visibleRows = expanded ? rows : rows.slice(0, 8);

  return (
    <section className="provider-column" style={{ "--provider": provider.accent }}>
      <div className="provider-header">
        <span className="provider-chip">{provider.name}</span>
        <div>
          <strong>{provider.label}</strong>
          <a href={provider.source} target="_blank" rel="noreferrer">
            official catalog
          </a>
        </div>
      </div>

      <div className="provider-services">
        {visibleRows.map((mapping) => (
          <ServiceCard
            key={`${provider.key}-${mapping.id}`}
            mapping={mapping}
            provider={provider}
            selected={mapping.id === selectedId}
            onSelect={() => onSelect(mapping.id)}
            showGaps={showGaps}
          />
        ))}
      </div>

      {rows.length > 8 && (
        <button className="show-more" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show fewer layers" : `Show alternatives (${rows.length - 8})`}
        </button>
      )}
    </section>
  );
}

function MetricsDock({ selected, showGaps, setShowGaps, region, workload, environment, compliance }) {
  const statusCounts = Object.values(selected.services).flatMap((items) => items.map((item) => item[2]));
  const exactOrClose = statusCounts.filter((status) => status === "Equivalent" || status === "Close").length;
  const denominator = statusCounts.length || 1;
  const calculatedConfidence = Math.round((exactOrClose / denominator) * 100);
  const confidence = Math.round((selected.confidence + calculatedConfidence) / 2);

  return (
    <section className="metrics-dock">
      <div className="metric-card impact">
        <span>Migration impact</span>
        <div className="gauge" style={{ "--value": `${selected.impact * 3.6}deg` }}>
          <b>{selected.impact}</b>
          <small>/100</small>
        </div>
        <div>
          <strong>{selected.impact >= 65 ? "High impact" : selected.impact >= 45 ? "Moderate impact" : "Lower impact"}</strong>
          <p>{selected.migration}</p>
        </div>
      </div>

      <div className="metric-card confidence">
        <span>Equivalence confidence</span>
        <div className="gauge" style={{ "--value": `${confidence * 3.6}deg` }}>
          <b>{confidence}%</b>
        </div>
        <div>
          <strong>{confidence >= 85 ? "High" : confidence >= 70 ? "Medium" : "Needs review"}</strong>
          <p>Confidence blends sample mapping quality and layer-specific risk.</p>
        </div>
      </div>

      <div className="metric-card compliance">
        <span>Compliance and governance</span>
        <ul>
          <li>
            <b>Region</b>
            {region}
          </li>
          <li>
            <b>Workload</b>
            {workload}
          </li>
          <li>
            <b>Environment</b>
            {environment}
          </li>
          <li>
            <b>Control lens</b>
            {compliance}
          </li>
        </ul>
      </div>

      <div className="metric-card gaps">
        <div className="toggle-title">
          <span>Show gaps</span>
          <label className="switch">
            <input type="checkbox" checked={showGaps} onChange={(event) => setShowGaps(event.target.checked)} />
            <i />
          </label>
        </div>
        <div className="gap-counts">
          <span>
            <b>{selected.gap.critical}</b>
            Critical
          </span>
          <span>
            <b>{selected.gap.high}</b>
            High
          </span>
          <span>
            <b>{selected.gap.medium}</b>
            Medium
          </span>
          <span>
            <b>{selected.gap.review}</b>
            Review
          </span>
        </div>
      </div>
    </section>
  );
}

function DetailDrawer({ open, selected, setOpen }) {
  return (
    <aside className={open ? "detail-drawer open" : "detail-drawer"}>
      <div className="drawer-header">
        <div>
          <span>Selected layer</span>
          <h2>{selected.layer}</h2>
          <p>{selected.layerNote}</p>
        </div>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
      <section>
        <h3>Migration note</h3>
        <p>{selected.migration}</p>
      </section>
      <section>
        <h3>Provider mapping</h3>
        {providers.map((provider) => (
          <div className="drawer-provider" key={provider.key}>
            <strong style={{ color: provider.accent }}>{provider.name}</strong>
            <ul>
              {selected.services[provider.key].map(([name, desc, status]) => (
                <li key={`${provider.key}-${name}`}>
                  <span>{name}</span>
                  <small>{desc}</small>
                  <em className={`status-pill ${getStatusClass(status)}`}>{status}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>Catalog sources</h3>
        <p className="source-note">
          This sample demo links to official provider catalogs. Treat equivalence labels as a
          prototype data model until validated against current service documentation and your Oracle
          tenancy constraints.
        </p>
        <div className="source-links">
          {providers.map((provider) => (
            <a key={provider.key} href={provider.source} target="_blank" rel="noreferrer">
              {provider.name} catalog
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
}

export function App() {
  const [selectedId, setSelectedId] = useState("route");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [preset, setPreset] = useState("Standard Web Application");
  const [comparison, setComparison] = useState("Prod Web App v2");
  const [region, setRegion] = useState("US East");
  const [workload, setWorkload] = useState("Web Application");
  const [environment, setEnvironment] = useState("Production");
  const [compliance, setCompliance] = useState("SOC 2, ISO 27001");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [showGaps, setShowGaps] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1350,
  );

  const filteredMappings = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return mappings.filter((mapping) => {
      const categoryMatch = category === "All Categories" || mapping.category === category;
      const searchMatch = !normalized || serviceSearchText(mapping).includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const selected = useMemo(() => {
    return mappings.find((mapping) => mapping.id === selectedId) || filteredMappings[0] || mappings[0];
  }, [filteredMappings, selectedId]);

  const rows = filteredMappings.length > 0 ? filteredMappings : [selected];

  return (
    <div className="app-shell">
      <TopBar
        search={search}
        setSearch={setSearch}
        preset={preset}
        setPreset={setPreset}
        comparison={comparison}
        setComparison={setComparison}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <div className={drawerOpen ? "app-body drawer-visible" : "app-body drawer-hidden"}>
        <Sidebar
          category={category}
          setCategory={setCategory}
          region={region}
          setRegion={setRegion}
          workload={workload}
          setWorkload={setWorkload}
          environment={environment}
          setEnvironment={setEnvironment}
          compliance={compliance}
          setCompliance={setCompliance}
          showDeprecated={showDeprecated}
          setShowDeprecated={setShowDeprecated}
        />

        <main className="workspace">
          <section className="workspace-heading">
            <div>
              <h1>Architecture comparison</h1>
              <p>
                Sample service mapping for {preset.toLowerCase()} / {comparison}. Validate against
                official catalogs before using for architecture decisions.
              </p>
            </div>
            <div className="view-mode" aria-label="View mode">
              <button className="active">Matrix</button>
              <button>Cards</button>
            </div>
          </section>

          <section className="comparison-board">
            <ProviderColumn
              provider={providers[0]}
              rows={rows}
              selectedId={selected.id}
              onSelect={setSelectedId}
              showGaps={showGaps}
            />
            <ArchitectureStack rows={rows} selectedId={selected.id} onSelect={setSelectedId} />
            {providers.slice(1).map((provider) => (
              <ProviderColumn
                key={provider.key}
                provider={provider}
                rows={rows}
                selectedId={selected.id}
                onSelect={setSelectedId}
                showGaps={showGaps}
              />
            ))}
          </section>

          <MetricsDock
            selected={selected}
            showGaps={showGaps}
            setShowGaps={setShowGaps}
            region={region}
            workload={workload}
            environment={environment}
            compliance={compliance}
          />

          <footer className="workspace-footer">
            <span className="legend equivalent">Equivalent</span>
            <span className="legend close">Close</span>
            <span className="legend partial">Partial</span>
            <span className="legend review">Review required</span>
            <span>
              Representative seed dataset: {mappings.length} capability mappings across four cloud
              providers.
            </span>
          </footer>
        </main>

        <DetailDrawer open={drawerOpen} selected={selected} setOpen={setDrawerOpen} />
      </div>
    </div>
  );
}
