### Networking

#### Ingress

In order to allow your users and the public to reach your site, you should use the ingress (a collection of rules that allow inbound connections to reach your services) that Datica provides. This is important to help ensure that all traffic is encrypted.

The ingress maps a hostname and path (which could just be / to route all traffic from the hostname) to a kubernetes service. For each cluster there is a single ingress-controller which has a public NLB. As an end-user, you can create a CNAME record that maps whatever domain name you'd like to the NLB's DNS name. You would then use that CNAME as the hostname in the ingress resource for your application. What this does is tell the ingress-controller that any traffic sent to the CNAME should be directed to the service that is specified in the ingress.

#### Managing TLS Certificates
The most common way of serving HTTPS on CKS is to set up a TLS definition in your ingress resources. This will tell the ingress-controller to load the specified TLS secret and serve HTTPS for any requests routed to the associated ingress resource. TLS will terminate at the ingress-controller, and from there the request will be routed to the appropriate service over the encrypted cluster network. The [ingress YAML](https://github.com/daticahealth/k8s-example/blob/master/ingress.yaml) from our k8s-example project has an example of how this works. The secret specified in `secretName` must be an existing TLS secret object in the same namespace as the ingress resource. The certificates in the secret may be sourced from any public or private CA you wish to use.

#### Configuration
To set custom nginx configurations that apply to all ingress resources, you can edit the `nginx-configuration` configmap in the `ingress-nginx` namespace. While most resources created by Datica cannot be edited without losing your changes the next time Datica applies an update, any changes made to this configmap will be left untouched. 

As an example, here is how you might add custom headers to be returned to the client on any request going through ingress-nginx:

Create a file called `custom-headers.yaml` with the headers to be applied:

```
apiVersion: v1
kind: ConfigMap
data:
  X-Custom-Header: "this is a header"
  X-Time: ${msec}
metadata:
  name: custom-headers
  namespace: ingress-nginx
```

And then apply it to the cluster:

```
kubectl apply -f custom-headers.yaml
```

Now apply a patch to the `nginx-configuration` configmap that instructs the ingress-controller to add headers to the client response based on the data in the `custom-headers` configmap:

```
kubectl -n ingress-nginx patch configmap nginx-configuration --patch '{"data": {"add-headers": "ingress-nginx/custom-headers"}}'
```

The ingress-controller will automatically detect that changes have been made, and reload nginx. 
Now any request you make over ingress will have the new headers added to the response. Note that while the ingress-controller monitors chagnes to the `nginx-configuration` configmap, at this time it does not watch for changes to the configmaps specified by either the `add-headers` or `proxy-set-headers` configurations. In order to see the effect of new changes made to the `custom-headers` configmap, you will need to manually restart the ingress-controller pods, like so:

```
# Update custom-headers configmap

kubectl -n ingress-nginx get po
# Selects first nginx-ingress-controller pod

kubectl -n ingress-nginx delete po <FIRST_POD_NAME>

kubectl -n ingress-nginx get po -w
# Wait for first pod to be replaced and become ready

kubectl -n ingress-nginx delete po <SECOND_POD_NAME>
```

#### Note
It is important to note that when creating resources on Kubernetes, it is imperative to always use Datica-provided networking solutions. In particular, *do not use the host network* for resources (such as the setting `hostNetwork: true`) as this can result in unencrypted traffic. ALWAYS use Datica's provided ingress.