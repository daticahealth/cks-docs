## Logging and Monitoring

Before deploying your workloads onto your new Kubernetes cluster. You'll want to ensure you can access the various deployments Datica provides. Those include:

**Logging access**

```
kubectl port-forward -n logging service/kibana 8001:80 - In your browser, the kibana dashboard can be accessed at the following url: http://localhost:8001
```

**Monitoring access**

```
kubectl port-forward -n monitoring service/grafana 8002:3000 - In your browser, the grafana dashboard can be accessed at the following url: http://localhost:8002
```
