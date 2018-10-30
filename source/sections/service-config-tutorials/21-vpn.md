### Private VPN Connections

In this document we will demonstrate how to connect a remote application to your application running in your Kubernetes cluster. For the demonstration we will be using the AWS VPC VPN, an internal-only Ingress service, and the Kubernetes Guestbook example application. This document makes no assumptions about the VPN device being connected to other than familiarity with the device and ipsec VPN that supports IKEv1. One of the reason we are performing this demonstration using the AWS VPC VPN is that at the end of the VPN setup process you can download a configuration for a number of common VPN devices.

To get started we will need to gather some information about the VPN device to which we are connecting. The following information will be needed:

- Internet IP address of the VPN device
- If you plan on using Border Gateway Protocol for dynamic routing you will need the BGP ASN of the VPN device
- If you plan on using static routing you will need CIDR ranges associated with the remote network(s)

Once you have this information you can proceed with the creation of the VPN following the instructions from AWS ([https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/SetUpVPNConnections.html](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/SetUpVPNConnections.html)). One important thing to note about the AWS VPN is that it does not act as a connection initiator. If you plan on initiating connections from your application running on Kubernetes, you will need to set up some sort of ping or keepalive on the remote side to keep the VPN up.

Now that you have a working VPN connection you can expose the application to the VPC. This is accomplished using a Kubernetes Ingress service with a load balancer set to internal-only mode. To get an application working for demonstration purposes I used the Guestbook application provided by Kubernetes ([https://kubernetes.io/docs/tutorials/stateless-application/guestbook/](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)). I followed this example pretty closely. The only changes I made were to install the application into its own namespace so that it would be easier to completely remove, and also the changes needed for it to utilize an internal-only Ingress service. In the frontend-service.yaml file I changed `type: NodePort` to `type: ClusterIP`. I then created an ingress configuration for the service which is as follows:

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: frontend-ingress
  annotations:
    kubernetes.io/ingress.class: internal-nginx
  namespace: guestbook
spec:
  tls:
    - hosts:
      - guestbook.mycluster.example.com
      secretName: guestbook-certificate
  rules:
    - host: guestbook.mycluster.example.com
      http:
        paths:
        - path: /
          backend:
            serviceName: frontend
            servicePort: 80
```

Of particular importance is `the kubernetes.io/ingress.class` annotation. This is what assigns this ingress to the internal ingress service. Since the ingress service is configured to only allow https, I also needed to create a certificate and put it in a secret. You can see that the above ingress config specifies some tls settings. This tells the internal ingress service that this ingress needs to use the certificate located in the the guestbook-certificate secret. To create the guestbook-certificate secret I ran the following commands:

I used a self-signed certificate for testing. In any environment that interacts with ePHI you will need to use a certificate signed by a certificate authority.

`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout guestbook.mycluster.example.com.key -out guestbook.mycluster.example.com.crt -subj "/CN=guestbook.mycluster.example.com/O=guestbook.mycluster.example.com"`

Create the secret from the contents of the certificate and key.

`kubectl --namespace=guestbook create secret tls guestbook-certificate --key guestbook.mycluster.example.com.key --cert guestbook.mycluster.example.com.crt`

We will also need a DNS record for the internal service. For simplicity I am using a public DNS zone hosted by AWS Route53 for the guestbook.mycluster.example.com CNAME to the internal ingress service’s load balancer. This can be done with private DNS services, but explaining how to do that is well beyond the scope of this document.

With the guestbook application modified and deployed according to its documentation along with the additional frontend-ingress and the route53 CNAME in place we can test connectivity. To do this I ran a curl request from the remote VPN device.

```
myvpn:~# curl --insecure https://guestbook.mycluster.example.com
<html ng-app="redis">
  <head>
    <title>Guestbook</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
    <script src="controllers.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.0/ui-bootstrap-tpls.js"></script>
  </head>
  <body ng-controller="RedisCtrl">
    <div style="width: 50%; margin-left: 20px">
      <h2>Guestbook</h2>
    <form>
    <fieldset>
    <input ng-model="msg" placeholder="Messages" class="form-control" type="text" name="input"><br>
    <button type="button" class="btn btn-primary" ng-click="controller.onRedis()">Submit</button>
    </fieldset>
    </form>
    <div>
      <div ng-repeat="msg in messages track by $index">
        {{msg}}
      </div>
    </div>
    </div>
  </body>
</html>
```

Here we can see that we are able to connect to our internal service over the VPN. This connection is fully secured using encryption in transit. From the remote VPN device - or whatever devices route through the VPN device - there is an https connection created. This connection traverses the VPN tunnel which is a second layer of encryption. The https connection exits the tunnel and travels through the load balancer. No SSL offload is performed on the load-balancer. Doing so would send unencrypted traffic to the Kubernetes cluster. Instead the https connection is SSL terminated at the ingress service. The ingress service is directly connected to the Kubernetes cluster’s encrypted overlay network. Thus you have a fully encrypted connection between applications running in separate networks over a private network link.

