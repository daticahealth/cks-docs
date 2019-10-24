### April 23, 2019

#### Updates
This release updates all components of kubernetes to 1.13.5, and 1.13.3 for CRI-O. All Datica deployed components will now make use of pod priority policies to ensure core cluster and compliance pods will not be evicted when a node runs out of resources. Also included in this release is an update to the blockstoragebackup cronjob to ensure that it is only snapshotting volumes attached to nodes of the cluster, rather than snapshotting all volumes in the region.
