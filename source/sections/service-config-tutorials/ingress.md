### Application Ingress

#### Intro
Secure ingress is one of most important parts of a compliant cluster. In CKS, we use the ingress-nginx project to provide a single access-logged point of ingress into the cluster network. Using routing rules and TLS definitions configured by ingress resources, multiple applications can be exposed to the public internet over the Network Load Balancer provisioned for your cluster. The ingress-contoller handles determining which ingress best matches the incoming URL, and routes the request to the appropriate service backend. If none of the ingress resources have a match then the request is routed to the default-http-backend, which responds `default backend - 404`.

This tutorial will step through a basic deployment based on the [k8s-example project](https://github.com/daticahealth/k8s-example) to expose an application on the public internet over HTTPS.

#### Example

**Step 1**
Clone the k8s-example project

```sh
$ git clone https://github.com/daticahealth/k8s-example.git
```

This project contains a set of templates that demonstrate a simple app deployment, along with a bash script that uses them to generate valid Kubernetes YAML files. The script assumes a Unix-like environment with the command line utility `sed` installed.

**Step 2**
Pick a host name for your app.

This host name will be a DNS CNAME entry that points to the load balancer for your cluster's ingress-controller. For this example, we will use `cks.example.com`.

To find the load balancer address for the cluster, run the following command:

```sh
$ kubectl -n ingress-nginx get svc ingress-nginx -o wide

NAME            TYPE           CLUSTER-IP    EXTERNAL-IP        PORT(S)                      AGE     SELECTOR
ingress-nginx   LoadBalancer   10.32.0.188   <NLB_Address>      80:30236/TCP,443:31494/TCP   18d     app=ingress-nginx
```

Create a CNAME record, with the name you selected, that points to the `EXTERNAL-IP` address listed by the command above. At Datica, we use AWS Route53 to manage our DNS records, but any DNS provider will work.

_Note_: If you do not own a domain, and do not wish to set one up at this time, you can use the ingress load balancer address to expose your app. However, since an X509 certificate cannot have a Common Name longer than 64 characters you will not be able to set this address as the CN for your certificate. Instead you would need to generate a certificate that includes the load balancer address as a DNS SAN, which takes a bit more setup to create than what is described here.

**Step 3**
Generate Kubernetes YAML for the app

Now that we have chosen a host name for the application, we can generate the YAML to describe the deployment, service, and ingress resources. The `template.sh` script in k8s-example will take care of this for us.

```sh
$ ./template.sh --deployment example --namespace default --image nginxdemos/hello --port 1234 --hostname cks.example.com
```

There should now be three YAML files under the `example` directory, one for each resource.

**Step 4**
Create TLS certificate

Next, we will generate a self-signed certificate for serving the application over HTTPS. While this would not be appropriate for a production app, it is sufficient for a test deployment. Any certificate used for serving HTTPS must have either a Common Name (CN) or a Subject Alternative Name (SAN) that matches the hostname in the request sent by the client.

Note that the CN passed for the subject in the command below is set to `cks.example.com`, matching the CNAME record that we just created and the host that is set on the ingress resource.

```sh
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout example-key.pem -out example-cert.pem -subj "/CN=cks.example.com/O=datica-example"
```

Once you have generated your key and certificate, upload them to your cluster as a TLS Secret to allow the ingress-controller to make use of them for your ingress resource. The secret must be created in the same namespace that your application will be deployed in, `default` in this case.

```sh
$ kubectl --namespace default create secret tls example-tls --cert=./example-cert.pem --key=./example-key.pem
```

**Step 5**
Deploy the application

Now that the YAML files and TLS Secret have been created, we are ready to deploy the application.

```sh
$ kubectl apply -f ./example/deployment.yaml
$ kubectl apply -f ./example/service.yaml
$ kubectl apply -f ./example/ingress.yaml
```

If you look at the logs for your cluster's ingress-controller deployment you will see that it finds the new ingress resource as soon as it is created, and reloads nginx with the new configuration.

These logs will look something like this:

```sh
$ kubectl -n ingress-nginx logs -l app=ingress-nginx

I0507 02:48:24.548467       8 event.go:218] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"example", UID:"9554489c-7072-11e9-be3e-02d978fa86a2", APIVersion:"extensions", ResourceVersion:"3362903", FieldPath:""}): type: 'Normal' reason: 'CREATE' Ingress default/example
I0507 02:48:24.549097       8 backend_ssl.go:67] adding secret default/example-tls to the local store
I0507 02:48:24.549214       8 controller.go:168] backend reload required
I0507 02:48:24.631578       8 controller.go:177] ingress backend successfully reloaded...
```

**Step 6**
View the app

If everything is wired up correctly, your application should now be up and running at the CNAME you configured. For this example, we would go to `https://cks.example.com`.

Since the certificate we created is self-signed, any modern browser will tell you that the connection is not secure. If you inspect the details for the HTTPS connection you will see that it is receiving your certificate, but the connection is considered insecure because the cert is self-signed. This is expected, since there is no way for a browser to check the validity of a self-signed certificate. It is safe to proceed, (so long as you trust yourself!). In production, you should always use a certificate signed by a public CA. At Datica, we use Let's Encrypt for this purpose.

If you have deployed the `nginxdemos/hello` image, it will display a page with some information about the server it is running on. Since the container is running in a Kubernetes pod the `Server Address` and `Server Name` will be the IP and name of the pod, rather than the external IP and name of the load balancer or the host you have configured for ingress. This is because Kubernetes and ingress-nginx abstract networking away from the container. From the container's point of view, the pod is the host that it lives on.

#### Common Problems

**Ingress-controller is serving "Kubernetes Ingress Controller Fake Certificate" instead of the configured certificate**

The `Kubernetes Ingress Controller Fake Certificate` is a self-signed certificate used in the ingress-controller to serve HTTPS for any routes that do not have a valid TLS configuration. If your ingress has TLS defined but you are still seeing the wrong certificate when visiting the site, then it is likely that there is something misconfigured in your ingress resource, or in your certificate.

For the ingress resource check closely to make sure there are no typos in the TLS config, and that the CNAME is set as the host for the route and is in the list of hosts for the TLS config. A small error, such as:

```yaml
  tls:
  - hosts:
    - cks.example.com
  - secretName: example-tls
```
(incorrect)

vs

```yaml
  tls:
  - hosts:
    - cks.example.com
    secretName: example-tls
```
(correct)

can cause Kubernetes to accept the YAML as valid, while also causing the ingress-controller to ignore the TLS secret for your list of hosts.

For the certificate, verify the `secretName` specified in the ingress resource matches the name of a valid TLS Secret in the same namespace. Also make sure that it has a CN or SAN that matches the CNAME DNS record you are using for the application. If it does not, then the ingress-controller will consider it to be an invalid certificate, and will not use it to serve HTTPS.

When debugging ingress, it is always useful to check the logs for the ingress-controller deployment. If a TLS secret is being rejected, the ingress-controller will often log information about the problem. As an example, if I create a certicate with the CN `cks.example.com`, but configure my ingress to use the NLB address as the host, then the ingress controller will reject the certificate on the grounds that it does not match the route configured for my ingress:

```
ssl certificate default/example-tls does not contain a Common Name or Subject Alternative Name for host <NLB_Address>. Reason: x509: certificate is valid for cks.example.com, not <NLB_Address>
```

After updating the ingress resource to use `cks.example.com` for the host (and list of hosts under the TLS config) the ingress-controller will detect that an ingress resource has changed, and reload nginx with the new configuration.

**Certificate Chaining**

In production, it is common for a certificate to be part of a cert chain, each one validating the trust of the one before it until you reach the Root Certificate Authority. In the simplest example, a Root CA would sign an Intermediate CA, which could then be used to sign your leaf certificate(s). This allows the Root CA to remain locked away, while still being able to sign new leaf certificates using the shorter-lived Intermediate CA. It is important that the TLS Secret contains full chain of certificates up to (but not including) the  public trusted root in order for an end-user to verify the chain of trust.

A chain of certificates would look like this:

```
-----BEGIN CERTIFICATE-----
...
<Leaf Cert>
...
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
...
<Intermediate Cert>
...
-----END CERTIFICATE-----
```

If you choose to use an automated certificate controller, such as [cert-manager](https://docs.cert-manager.io/en/latest/), then it will handle creating this chain for you in your Secret. Otherwise, just make sure that the file you upload as the cert for your TLS Secret contains a valid chain.