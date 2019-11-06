### Capacity Planning
As the resource requirements of your applications grow, you may need to consider expanding your cluster. A standard CKS deployment comes with three m5.xlarge worker nodes, but CKS supports increasing the size of these worker nodes as well as increasing the number of worker nodes in the cluster. 

#### Grafana Dashboards
CKS provides several Grafana dashboards to assist with capacity planning. To access these dashboards, you can use the command `kubectl port-forward -n monitoring svc/grafana 3000:3000` and navigate in a browser to http://localhost:3000/.

The Kubernetes Capacity Planning dashboard shows overall usage statistics for the cluster. It includes details such as memory, CPU, disk, and network utilization. The Kubernetes Cluster Status dashboard contains graphs that show resource utilization as a percentage of the total available, as well as high-level information about the cluster's health. The Kubernetes Resource Requests dashboard summarizes the [resources requested by workloads](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/) in your cluster. The requested resources can be compared to the actual usage statistics to determine if, on average, your workloads are requesting the resources they actually need.

The Grafana deployment includes several other dashboards that you may find useful for monitoring the health and usage of your cluster. We highly recommend taking a few minutes to see which dashboards are available and considering how they might help you make the best use of your cluster.