### Logging

#### Applications
Any logs written to STDOUT or STDERR by containers on CKS are picked up by Kubernetes, and stored on the host filesystem. Fluentd retrieves the logs from there and forwards them to Elasticsearch and S3. Elasticsearch indices are pruned after five days, but the S3 log archives are retained for the life of the cluster. All indexed logs are viewable in the Kibana dashboard.

#### Encryption
Each node has an encrypted logging volume attached to securely store logs before they have been processed. Once picked up by Fluentd, they are sent over the encrypted cluster network to an Elasticsearch client, which stores them on its own encrypted Persistent Volume. Archived logs are sent to S3 using the Amazon S3 API over HTTPS, and are stored in the encrypted cluster bucket.

#### Limits
The primary bottleneck in the CKS logging stack is Elasticsearch volume IOPS. By default, CKS deploys 2 es-client pods, each with a 100GiB GP2 EBS volume. GP2 volumes deliver 3 IOPS/GB with a burst balance of 3,000 IOPS, meaning each Elasticsearch client has approximately 300 baseline IOPS. With the default setup, the CKS logging stack can handle around 1 million logs per hour without expending burst balance.

If an es-client expends the available burst balance on its volume, Elasticsearch will be unable to index logs as fast as they can be ingested. When this happens, the bulk ingestion queue fills up and new requests will be rejected. This causes the log buffers on CKS nodes to fill up, and over time may result in pods failing to deploy on nodes where the log volume has filled completely. As a temporary measure, the volume can be expanded incrementally, since each time an EBS volume is resized it starts with a full burst balance. Note that AWS EBS volumes can only be expanded once every 6 hours however.

Volume expansion is enabled on the `persistent-storage` StorageClass in CKS, so you can expand these volumes yourself by following these steps:

```
kubectl -n kube-system patch pvc elasticsearch-data-es-client-0 --patch='{"spec": {"resources": {"requests": {"storage": "<NEW VOLUME SIZE>Gi"}}}}'
kubectl -n kube-system patch pvc elasticsearch-data-es-client-1 --patch='{"spec": {"resources": {"requests": {"storage": "<NEW VOLUME SIZE>Gi"}}}}'
```

As of Kubernetes 1.15, the ExpandInUsePersistentVolumes feature is enabled by default, so the volumes will expand their filesystems without any further action.

If the available burst balance is continually drained due to high logging throughput, then the Elasticsearch volumes will need to be overprovisioned such that burst balance is no longer a factor. EBS volumes with a capacity of 1TB or more do not have a burst balance, since they generate enough IOPS to replenish burst before it can be used. Expanding your elasticsearch-data-es-client PVCs to 1000Gi will eliminate the IOPS bottleneck from the system, and significantly increase the number of logs that can be handled by the logging stack.

#### Audit 
Any cluster can also have CKS host kernel-level audit logging enabled, these los will be treated the same as application logs (sent to S3 on for the life of the cluster and indexed in Elasticsearch for 5 days). Please submit a support ticket if you would like this feature enabled, make sure to take a look at the caveats below prior to creating your request. These audit logs include but are not limited to:
* Kernel Parameter/Module Modifications
* Mount Operations
* Cron Scheduling
* Sudoers, Passwd, User, Group, Password Database Changes
* Network Environment Changes
* Systemd Changes/Operations

By default this feature is disabled. Before requesting that this be enabled, please review the following caveats:
* High likelihood of needing to increase logging volume storage across all nodes. If those volumes are not actively monitored and they fill up, they can cause service interruption by preventing unrelated pods from starting properly.
* Moderate increase on the load of Elasticsearch, increased index sizes which could mean slight performance degredation of Elasticsearch if not addressed.
* Moderate increase on the volume of logs stored in S3, which will likely cost more depending on your [AWS S3 Pricing](https://aws.amazon.com/s3/pricing/)
