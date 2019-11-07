### Cloud Resources
Currently, CKS is only supported in AWS. CKS clusters makes use of the following resources:

- IAM Policies
- IAM Profiles
- IAM Roles
- Key Pairs
- VPC Network
- VPC NAT Gateways
- Route 53 Zone
- Route 53 Entries
- VPC Subnets
- VPC Internet Gateway
- VPC Route Table and Routes
- VPC Network ACLs
- Security Groups
- S3 Buckets
- ELB
- NLB
- EC2 Instances
- Elastic IP Addresses (one per NAT Gateway)
- EBS Volumes (and snapshots)

For cost estimation, a standard CKS cluster will use the following minimum resources:

- 6 m5.xlarge EC2 Instances
- Various EBS volumes, using around 500 GiB of GP2 storage, and a small amount of standard storage.
- 4 EBS snapshots per volume (1 per day, stored for two days and region-replicated)
- 1 Elastic IP per Availability Zone (varies per region)
- 1 ELB
- 1 NLB
- 3 S3 buckets
- 1 Private Hosted Zone in Route53
- 1 VPC

The costs of these resources may vary based on network usage, customer deployments, and any customizations that are made to the cluster.