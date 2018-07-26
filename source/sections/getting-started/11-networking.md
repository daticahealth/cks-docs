### Networking

#### Ingress

In order to allow your users and the public to reach your site, you'll need to create an ingress — a collection of rules that allow inbound connections to reach your services.

To create an ingress for your application, [please follow this guide from Kubernetes](https://v1-9.docs.kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource.).

The ingress maps a hostname and path (which could just be / to route all traffic from the hostname) to a kubernetes service. For each cluster there is a single ingress-controller which has a public ELB. As an end-user, you can create a CNAME record that maps whatever domain name you'd like to the ELB's DNS name. You would then use that CNAME as the hostname in the ingress resource for your application. What this does is tell the ingress-controller that any traffic sent to the CNAME should be directed to the service that is specified in the ingress.

#### Other configurations