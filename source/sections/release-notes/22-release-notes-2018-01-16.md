## Release Notes

### January 16, 2018 Release Notes

The latest CKS release will be hitting staging clusters January 16 starting at 9am CST. In this release, we’ve made significant improvements to our vulnerability management tooling as well as core Kubernetes components. See the full release notes below:

#### Updates

- We will be installing [Wazuh](https://wazuh.com/) on all customer CKS clusters. Wazuh improves our ability to scan the cluster for vulnerabilities — similar to Nessus, alerts from Wazuh will be sent directly to Datica’s security team for evaluation and handling, including direct customer notification as necessary.
- The deployments for ingress, coredns, elasticsearch, and prometheus-operator are now configured to land on controller nodes, leaving more capacity on worker nodes for customer workloads.
- System volumes and snapshots will have tags for faster recovery in the event of a disaster.

#### Bug Fixes

- Fixed internal Prometheus communication issues enabling grafana to pull in more default data.

#### Customer Support:

- In order to tend to your support issue in a timely manner, please submit your ticket through the [Platform dashboard](https://product.datica.com) by clicking on the “Contact Support” button located in the footer of the Environment UI. This provides valuable metadata to the support staff, which allow them to triage the issue much quicker.
- Our Support Policies: Support is provided in English from our offices in Madison, WI.
- Support hours are Monday through Friday 9:00 a.m. to 5:00 p.m. CST.