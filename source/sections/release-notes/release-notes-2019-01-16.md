### January 16, 2019

The latest CKS release will be hitting staging clusters January 16 starting at 9am CST. In this release, we’ve made significant improvements to our vulnerability management tooling as well as core Kubernetes components. See the full release notes below:

#### Updates

- We will be installing [Wazuh](https://wazuh.com/) on all customer CKS clusters. Wazuh improves our ability to scan the cluster for vulnerabilities — similar to Nessus, alerts from Wazuh will be sent directly to Datica’s security team for evaluation and handling, including direct customer notification as necessary.
- The deployments for ingress, coredns, elasticsearch, and prometheus-operator are now configured to land on controller nodes, leaving more capacity on worker nodes for customer workloads.
- System volumes and snapshots will have tags for faster recovery in the event of a disaster.

#### Bug Fixes

- Fixed internal Prometheus communication issues enabling grafana to pull in more default data.
