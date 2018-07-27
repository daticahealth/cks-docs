### Networking

#### Ingress

In order to allow your users and the public to reach your site, you should use the ingress (a collection of rules that allow inbound connections to reach your services) that Datica provides. This is important to help ensure that all traffic is encrypted.

The ingress maps a hostname and path (which could just be / to route all traffic from the hostname) to a kubernetes service. For each cluster there is a single ingress-controller which has a public ELB. As an end-user, you can create a CNAME record that maps whatever domain name you'd like to the ELB's DNS name. You would then use that CNAME as the hostname in the ingress resource for your application. What this does is tell the ingress-controller that any traffic sent to the CNAME should be directed to the service that is specified in the ingress.

#### Other configurations
It is important to note that when creating resources on Kubernetes, it is imperative to always use Datica-provided networking solutions. In particular, *do not use the host network* for resources (such as the setting `hostNetwork: true`) as this can result in unencrypted traffic. ALWAYS use Datica's provided ingress.