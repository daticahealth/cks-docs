### July 30, 2019

#### Updates
- The cronjob responsible for managing backups is moving to the kube-system namespace.
- It is easier to add custom Grafana dashboards for monitoring. See our Grafana Dashboards Tutorial for more information.
- A bug that prevented default Prometheus alert rules from appearing in the alerts dashboard has been fixed.
- A bug caused by a timeout during the pruning of old snapshots that prevented the snapshots from being removed has been fixed.
