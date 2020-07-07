## Release Notes

### July 14th, 2020

#### Updates
This release includes several versioning updates and new features:

- Updated Prometheus Components
  - [Prometheus v2.18.1](https://github.com/prometheus/prometheus/tree/release-2.18/docs)
  - [Prometheus Operator v0.39.0](https://github.com/coreos/prometheus-operator/tree/v0.39.0/Documentation)
  - [Prometheus Push Gateway v1.2.0](https://github.com/prometheus/pushgateway/releases/tag/v1.2.0)
  - [Grafana v7.0.3](https://community.grafana.com/t/release-notes-v7-0-x/29381)
  - Updated list of Grafana Dashboards compatible with Kubernetes 1.17.3
  - Updated list of Default Prometheus Alerts compatible with Kubernetes 1.17.3
- Updated ClamAV Daemonset
  - [ClamAV v0.102.3](https://blog.clamav.net/2020/05/clamav-01023-security-patch-released.html)
  - Increased Memory Limit to 2Gi and CPU Limit to 1
- [Image Garbage Collection](https://cks-docs.datica.com/#ImageGarbageCollection) threshold increased from 15% to 20% to help cleanup image volume sooner
- An hourly etcd kubernetes cronjob in the `kube-system` namespace is scheduled to create and upload a snapshot to S3, with a default 7 day retention period for disaster recovery
- Several operational Bugfixes
- Several Security-related Bugfixes
