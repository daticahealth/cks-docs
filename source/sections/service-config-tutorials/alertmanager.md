### Custom AlertManager routing
Datica’s monitoring and alerting stack provides you with a tremendous amount of flexibility for defining your own alerts and how to receive them. In this section, we’ll show you how to configure custom routing for alerts.

The configuration for alertmanager is stored as a base64 encoded value within a Kubernetes secret called `alertmanager-main` in the `monitoring` namespace. To make changes to alertmanager, we will need to encode the new configuration as a base64 encoded value, then embed that value within the yaml file for the alertmanager secret, and finally apply that yaml so that the modified secret is deployed.

1. Retrieve the yaml for the alertmanager secret by running `kubectl get secret alertmanager-main -n monitoring -o yaml`. Save the yaml into a file so that it can be modified and applied back to the cluster later. 
1. Record the value from the `alertmanager.yaml` field in that file. This value is the base64 encoded version of the alertmanager configuration. Run `echo <value from field> | base64 --decode` to see the configuration yaml that is currently applied.
1. Modify the configuration yaml from step 2 as desired and save it as a new file. For more information on how to configure alertmanager, see https://prometheus.io/docs/alerting/configuration/.
1. Run `cat <filename from step 3> | base64 --encode` and insert the output in the `alertmanager-custom.yaml` file in the `alertmanager.yaml` field. This is the base64 encoded version of the modified alertmanager configuration file.
1. Apply the new configuration by running `kubectl apply -f alertmanager-custom.yaml`. The changes to alertmanager are applied immediately, and can be viewed in the alertmanager dashboard. To view the dashboard, run `kubectl port-forward -n monitoring service/alertmanager-main 9093:9093` and navigate to localhost:9093 in a browser. The current configuration can be found on the status page on the dashboard.
