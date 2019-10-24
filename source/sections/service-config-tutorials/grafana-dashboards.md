### Grafana Dashboards
_Note:_ Grafana access does not require any credentials, you will just need to have sufficient permissions on the Kubernetes cluster to view and edit resources in the monitoring namespace of your cluster.

#### Custom Dashboard installation
The steps below explain how to add a custom Grafana Dashboard to your cluster. Before starting, create your Grafana dashboard and export it as JSON (Refer to the [Grafana documentation](https://grafana.com/docs/reference/export_import/#discover-dashboards-on-grafana-com) for more information).

**Step 1**

Edit the `custom-grafana-dashboards` configmap

```sh
$ kubectl -n monitoring edit configmap custom-grafana-dashboards
```

**Step 2**

Add dashboards to the configmap, under the `data:` key. As many dashboards as you like can be added, each is just a unique JSON filename under the `data:` key with a multiline string containing the JSON dashboard definition.

If the configmap does not have a `data:` key, add one as shown below

```yml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  my-dashboard.json: |+
    {
        <YOUR NEW DASHBOARD>
    }
  another-great-dashboard.json: |+
    {
        <YOUR ADDITIONAL DASHBOARD>
    }
```

**Step 3**

Save and exit

**Step 4**

Redeploy Grafana, to pick up the custom dashboard changes

```sh
$ kubectl -n monitoring delete pods -l app=grafana
```
