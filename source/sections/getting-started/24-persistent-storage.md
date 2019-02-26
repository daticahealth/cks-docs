### Persistent Storage

You can configure any Deployment resource to use persistent storage by creating a PersistentVolumeClaim resource that makes use of the StorageClass resource `persistent-storage`, and then referencing that PersistentVolumeClaim in the Deployment yaml (https://kubernetes.io/docs/concepts/storage/persistent-volumes). The `persistent-storage` storage class has been created for you as part of CKS, and it is already configured for encryption, volume expansion, and retention of data (the EBS volume continues to exist) upon deletion of the PVC. 
