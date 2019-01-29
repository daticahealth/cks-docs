### Kubernetes Dashboard
_Note_: In order to install an application that requires system roles or service accounts on Datica CKS, it's necessary to first install the application using the Datica RBAC Admin user and then configure the roles for use using Datikube authentication. In the case of kubernetes-dashboard, the project recommends the creation of a system role and associated policies to limit the privileges granted to the application. Refer to the [Kubernetes Dashboard documentation](https://github.com/kubernetes/dashboard/wiki/Access-control#default-dashboard-privileges) for more information about what privileges are set up.

#### Installing the Kubernetes Dashboard using the RBAC Admin certificate
To install the Kubernetes Dashboard application in your cluster, execute the following commands (Before beginning this step, set a kubectl context that uses the Admin certificate):

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

#### Accessing the Dashboard
To help ensure that all access to the Dashboard and resources running on Kubernetes is handled appropriately, authenticate against the Kubernetes Dashboard using your Datica account. This prevents you from having to manage system roles directly and from accidentally exposing your cluster to would-be attackers due to misconfiguration. All access control is handled via Datica [Groups and ACLs](https://cks-docs.datica.com/#Access).

**Step 1**

Make sure you have an up-to-date Datica session token for use later on — then run `$ datikube refresh` and enter your account credentials when prompted. Next you can retrieve your updated token by running (save this token for use in step 4):

```
$ echo `kubectl config view -o jsonpath='{.users[?(@.name == "datica")].user.token}'`
```

**Step 2**

Next we're going to get the running pod name for the dashboard by running:

```
$ kubectl -n kube-system get pods | grep kubernetes-dashboard
```

This will output something similar to the following line:

```
kubernetes-dashboard-5bd6f767c7-44446                                   1/1       Running            0          25m
```

The first part is the pod name that is needed for the next step.


**Step 3**

In this step we're going to set up port-forward to the dashboard using the kubernetes-dashboard pod name. This allows you to securely access the dashboard through https://localhost:8001/. Run:

```
$ kubectl -n kube-system port-forward <pod-name> 8001:8443
```

(replace <pod-name> with the name of the pod running your dashboard (e.g. `kubernetes-dashboard-5bd6f767c7-44446`)

Now you can navigate to https://localhost:8001

*Note:* Unless you replaced it during installation, your browser will report the certificate as invalid because the kubernetes-dashboard serves self-signed certificates by default, which is specified in the kubernetes-dashboard.yaml deployment file. The [kubernetes-dashboard documentation](https://github.com/kubernetes/dashboard/wiki/Installation) provides instructions for replacing these certificates with valid CA-signed certificates. *IMPORTANT*: Whether you use self-signed or CA-signed certificates, Datica strongly recommends that you *do not* expose your kubernetes dashboard to the public Internet.

**Step 4**

The last step is to authenticate using Datica session token. At the login screen, select "Token" and enter the token from step 2. At this point, you should be able to see and use the kubernetes dashboard per its documentation. Remember, your permissions in the dashboard will be limited by the ACLs you have access to via Datica's [Product Dashboard](https://cks-docs.datica.com/#GroupsandACLs).
