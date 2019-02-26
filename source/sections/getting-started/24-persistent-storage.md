### Persistent Storage

You can configure any Deployment resource to use [persistent storage](https://kubernetes.io/docs/concepts/storage/persistent-volumes) by creating a PersistentVolumeClaim resource that makes use of the StorageClass resource `persistent-storage`, and then referencing that PersistentVolumeClaim in the Deployment yaml. The `persistent-storage` storage class has been created for you as part of CKS, and it is already configured for encryption, volume expansion, and retention of data (the EBS volume continues to exist) upon deletion of the PVC. 
