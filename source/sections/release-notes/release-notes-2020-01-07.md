### January 7, 2020

#### Updates
This release contains several small bugfixes and features. 
- The version of Alertmanager deployed to CKS clusters has been upgraded to v0.20.0.
- CoreOS (host-level) events are now logged to the CKS logging stack.
- Ingress controller metrics are now being collected and are available within Prometheus. 
- A bug that caused by a timeout during the creation of large snapshots has been fixed.