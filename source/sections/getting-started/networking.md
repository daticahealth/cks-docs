### Networking

#### Ingress

In order to allow your users and the public to reach your site, you should use the ingress (a collection of rules that allow inbound connections to reach your services) that Datica provides. This is important to help ensure that all traffic is encrypted.

The ingress maps a hostname and path (which could just be / to route all traffic from the hostname) to a kubernetes service. For each cluster there is a single ingress-controller which has a public NLB. As an end-user, you can create a CNAME record that maps whatever domain name you'd like to the NLB's DNS name. You would then use that CNAME as the hostname in the ingress resource for your application. What this does is tell the ingress-controller that any traffic sent to the CNAME should be directed to the service that is specified in the ingress.

#### Managing TLS Certificates
The most common way of serving HTTPS on CKS is to set up a TLS definition in your ingress resources. This will tell the ingress-controller to load the specified TLS secret and serve HTTPS for any requests routed to the associated ingress resource. TLS will terminate at the ingress-controller, and from there the request will be routed to the appropriate service over the encrypted cluster network. The [ingress YAML](https://github.com/daticahealth/k8s-example/blob/master/templates/ingress.yaml) from our k8s-example project has an example of how this works. The secret specified in `secretName` must be an existing TLS secret object in the same namespace as the ingress resource. The certificates in the secret may be sourced from any public or private CA you wish to use.

#### Global Configurations
To set custom nginx configurations that apply to all ingress resources, you can edit the `nginx-configuration` configmap in the `ingress-nginx` namespace. While most resources created by Datica cannot be edited without losing your changes the next time Datica applies an update, any changes made to this configmap will be left untouched. 

As an example, here is how you might add custom headers to be returned to the client on any request proxied through ingress-nginx:

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

Apply the new configmap to the cluster:

```
kubectl apply -f custom-headers.yaml
```

Now apply a patch to the `nginx-configuration` configmap that instructs the ingress-controller to retrieve headers from the `custom-headers` configmap:

```
kubectl -n ingress-nginx patch configmap nginx-configuration \
  --patch '{"data": {"add-headers": "ingress-nginx/custom-headers"}}'
```

The ingress-controller will automatically detect that changes have been made, and reload nginx. Updates to the configmaps referenced by either the `add-headers` or `proxy-set-headers` configurations are not monitored, however. In order to see the effect of new changes made to the `custom-headers` configmap, you will need to manually restart the ingress-controller pods, like so:

```
kubectl -n ingress-nginx get po
# Select first nginx-ingress-controller pod

kubectl -n ingress-nginx delete po <FIRST_POD_NAME>

kubectl -n ingress-nginx get po -w
# Wait for first pod to be replaced and become ready

kubectl -n ingress-nginx delete po <SECOND_POD_NAME>
```

For a full list of available configurations, reference the [NGINX Ingress Controller configmap documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)

#### Ingress Configurations
Individual ingress resources can also be configured via annotations, which will affect only the ingress on which they were applied. For instance, if you wanted to expose multiple services over the same hostname you might assign one ingress resource the path `/app1` and the second ingress `/app2`. But unless both apps are expecting their respective path prefixes, they will not know how the handle the request. To get around this, you can use the `nginx.ingress.kubernetes.io/rewrite-target` annotation to tell ingress-nginx which parts of the path to keep. Rewrite-target uses regex capture groups defined on the ingress path to determine what the final path should be. In the simplest case, where the `/app1` prefix is stripped off before the request is forwarded to the appropriate service, you would define the path in the ingress resource as `/app1(/|$)(.*)` to create two capture groups. The first is either `/` or the end of the path, and the second is anything that follows (defined by `.*`). Since we only want the contents of the second capture group, you would then add the annotation `nginx.ingress.kubernetes.io/rewrite-target: /$2` to instruct ingress-nginx to rewrite the request path with anything that follows `/app1` in the original request URI. More information on the rewrite-target annotaion can be found [here](https://kubernetes.github.io/ingress-nginx/examples/rewrite/#rewrite-target)

For a full list of available annotations, reference the [NGINX Ingress Controller annotaion documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)

#### Note
It is important to note that when creating resources on Kubernetes, it is imperative to always use Datica-provided networking solutions. In particular, *do not use the host network* for resources (such as the setting `hostNetwork: true`) as this can result in unencrypted traffic. ALWAYS use Datica's provided ingress.
