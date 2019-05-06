### Application Ingress

#### Intro
Secure ingress is one of most important parts of a compliant cluter. In CKS, we use the ingress-nginx project to provide a single point of ingress into the cluster. Using routing rules and TLS definitions configured in ingress resources, multiple applications can be exposed to the public internet over the Network Load Balancer provisioned for your cluster.

This tutorial will step through a basic deployment based on the [k8s-example project](https://github.com/daticahealth/k8s-example) to expose an application with TLS on the public internet.

#### Example

**Step 1**
Clone the k8s-example project

```sh
$ git clone https://github.com/daticahealth/k8s-example.git
```

This project contains a set of templates that demonstrate a simple app deployment, along with a bash script that uses them to generate valid Kubernetes YAML files.

**Step 2**
Pick a hostname for your app.

This hostname will be a DNS CNAME entry that points to the load balancer for your cluster's ingress-controller. For this example, we will use `example.datica-dev.com`.

To find the load balancer address for the cluster, run the following command:
```sh
$ kubectl -n ingress-nginx get svc ingress-nginx -o wide
```

Then, using the `EXTERNAL-IP` listed in the command above, create a CNAME entry that points to the NLB address.

**Step 3**
Generate Kubernetes YAML for the app

Now that we have chosen a hostname for the application, we can generate the YAML to describe the deployment, service, and ingress resources. The `template.sh` script in k8s-example will take care of this for us.

```sh
$ ./template.sh --deployment example --namespace example --image nginxdemos/hello --port 1234 --hostname example.datica-dev.com
```

There should now be three files under the `./example` directory, one for each resource.

**Step 4**
Create certs

Next, we will generate a self-signed certificate for serving the application over HTTPS. While this would not be appropriate for a production app, it is sufficient for a test deployment. Any certificate used for serving HTTPS must have either a Common Name (CN) or a Subject Alternative Name (SAN) that matches the hostname used to reach it. Note that the CN passed for the subject is set to `example.datica-dev.com`, matching the CNAME record that we just created and the hostname that is set on the ingress resource.

```sh
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout example-key.pem -out example-cert.pem -subj "/CN=example.datica-dev.com/O=datica-dev"
```

Once you have generated your certificate, upload the key and cert to your cluster as a TLS Secret to allow the ingress-controller to make use of them for your ingress resource. The secret must be created in the same namespace that your application will be deployed in, which we chose to be `default` above.
```sh
kubectl --namespace default create secret tls example-tls --cert=./example-cert.pem --key=./example-key.pem
```

**Step 5**
Deploy the application

Now that the YAML files and key-cert pair have been created, we are ready to deploy the application.

```sh
$ kubectl apply -f ./example/deployment.yaml
$ kubectl apply -f ./example/service.yaml
$ kubectl apply -f ./example/ingress.yaml
```

If you look at the logs for your cluster's ingress-controller deployment you will see that it finds the new ingress resource as soon as it is created, and reloads nginx with the new configuration.

These logs will look something like this:
```sh
$ kubectl -n ingress-nginx logs -l app=ingress-nginx

I0506 15:40:38.409587       8 event.go:218] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"example", UID:"2981f152-7015-11e9-9c24-0a3a6c9dd1e6", APIVersion:"extensions", ResourceVersion:"3278649", FieldPath:""}): type: 'Normal' reason: 'UPDATE' Ingress default/example
I0506 15:40:38.410780       8 controller.go:168] backend reload required
I0506 15:40:38.490997       8 controller.go:177] ingress backend successfully reloaded...
```

**Step 6**
View the app

If everything is wired up correctly, your application should now be up and running on the given hostname. For this example, we would go to `https://example.datica-dev.com`.

Since the certificate being used for serving HTTPS is self-signed, any modern browser will tell you that the connection is not secure. If you inspect the details for the HTTPS connection you will see that it is recieving your certificate, but is considered insecure because it is self-signed. This is expected, since there is no way for a browser to check the validity of a self-signed certificate. In production, you should always use a certificate signed by a public CA. At Datica, we use Let's Encrypt in-house for this purpose.