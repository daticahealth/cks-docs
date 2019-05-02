### Logging

#### Applications
Any logs written to STDOUT or STDERR by containers on CKS are picked up by Kubernetes, and stored on the host filesystem. Fluentd retrieves the logs from there and forwards them to Elasticsearch and S3. Elasticsearch indices are pruned after five days, but the S3 log archives are retained for the life of the cluster. All indexed logs are viewable in the Kibana dashboard.

#### Encryption
Each node has an encrypted logging volume attached to securely store logs before they have been processed. Once picked up by Fluentd, they are sent over the encrypted cluster network to an Elasticsearch client, which stores them on its own encrypted Persistent Volume. Archived logs are sent to S3 using the Amazon S3 API over HTTPS, and are stored in the encrypted cluster bucket.