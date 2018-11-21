### Access

Once we've provisioned your new cluster, we'll grant you access to that cluster. That process is as follows:

We'll create an organization on your behalf using the legal business name collected above. This organization lives within Datica's centralized authentication system. This system is responsible for managing users and cluster access.
After we've created the organization, you'll be sent an invite to your email on file (as well as any other administrators). Use this email to activate your account.

Once you've activated your account, you'll need to download and install the Datica datikube CLI utility. You can download the package and view instructions for installation here.

Once you've installed datikube, you'll need three pieces of information:

* `NAME` - This is the name you'd like to use for your cluster (ex: "prod", "staging", etc.). Datica will configure this for you.
* `CLUSTER-URL`- This is a URL at which this cluster's kube-apiserver is accessible. Datica will provide this to you.
* `CA-FILE` - This should be the relative path to the CA cert for this cluster. Datica will provide you with this file.

After you've gathered your cluster's name, cluster-url, and the ca-file, you can run the following command:

`datikube set-context <NAME> <CLUSTER-URL> <CA-FILE>`

Ex: `datikube set-context prod-cluster https://192.168.99.100:8443 ~/.example/ca.crt`

After successfully running the datikube set-context command with the parameters above, you can begin using your new compliant cluster!

Before deploying your workloads onto your new Kubernetes cluster. You'll want to ensure you can access the various deployments Datica provides. Those include:

* Logging access: kubectl port-forward -n logging service/kibana 8001:5601 - In your browser, the kibana dashboard can be accessed at the following url: http://localhost:8001
* Monitoring access: kubectl port-forward -n monitoring service/grafana 8002:3000 - In your browser, the grafana dashboard can be accessed at the following url: http://localhost:8002

*IMPORTANT* You should always make an effort to use kubectl authenticated with your Datica account credentials. However, sometimes you may want or need to use tools that require system roles. These types of tools cannot make use of Datica's webhook authentication/authorization. You must make use of Kubernetes RBAC functionality. Since this is in your application space, you will be responsible for proving and ensuring the security and compliance of the roles you set up in accordance with your own company policies.

### Groups and ACLs

Kubernetes ACLs can be constructed using the following sections, separated by:

* product - The first part of the ACL string should always be the exact string "product".
* cluster - The second part of the ACL string should always be the exact string "cluster".
* cluster name - The name of the cluster you want the ACL to apply to.
* action - This part of the ACL string should always be the exact string "action" OR "*".
* group - A group is a kubernetes-specific concept that overlaps with Datica's groups. With Datica CKS, this should always be `*`.
* namespace - A namespace is a kubernetes-specific concept. You can learn more about namespaces [here](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).
* resource - A resource is a Kubernetes-specific concept and is essentially any object that is set up on Kubernetes. You can see the full list of Kubernetes resource types [here](https://kubernetes.io/docs/reference/kubectl/overview/#resource-types).
* verb - The last part of the ACL string is the HTTP verb. The list of possible verbs can be viewed [here](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb). Make sure to use the request verbs, not the HTTP verbs. Case matters, so `get` will work as a verb, but `GET` will not. A final note on verbs: the kubectl `port-forward` command requires the ability to create pods.
When completely assembled, the string should look something like product:cluster:[cluster-name]:action:*:[namespace]:[resource]:[verb]

ACL String Examples:
To give a group access to retrieve the pods from a specific namespace, use the following ACL string: `product:cluster:mycluster:action:*:examplenamespace:pods:list`. This ACL string will provide users in this group access to list pods in the "examplenamespace" namespace using kubectl like `kubectl -n examplenamespace get pods`. 

To give a group access to view monitoring, use the following ACL string: `product:cluster:mycluster:action:*:monitoring:*`. This ACL string will provide users in this group access to retrieve all resources that are in the "monitoring" namespace.

To give a group access to view logging, use the following ACL string: `product:cluster:mycluster:action:*:logging:*`. This ACL string will provide users in this group access to retrieve all resources that are in the "logging" namespace.

To give a group full access to a specific namespace, use an ACL string like this: `product:cluster:mycluster:action:*:examplenamespace:*:*`. This ACL string will provide users in the group complete access to the "examplenamespace" namespace.

### Limiting Application Access

Developers may come across use cases in which an application will require talking to another component within CKS. For example, a CI/CD pipeline using [Jenkins](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)  or [Gitlab](https://about.gitlab.com/2017/09/21/how-to-create-ci-cd-pipeline-with-autodeploy-to-kubernetes-using-gitlab-and-helm/) that deploys directly into a cluster will require interacting with the API server. In these cases, you should [create a dedicated serviceaccount](https://itnext.io/the-abc-of-kubernetes-access-control-e7d280af5c88) with permissions limited to only what your application requires.

**Note:** The Jenkins tutorial linked above makes use of minikube. Be aware that some commands will differ from CKS.

The general steps (taken from the article linked above) for using a serviceaccount to provide limited permissions to an application are as follows:

1. Create namespace: `kubectl create ns myapp`
1. Create a serviceaccount: `kubectl -n myapp create sa thesa`
1. Create a rolebinding: `kubectl -n myapp create rolebinding samplerolebinding --clusterrole=edit --serviceaccount=myapp:thesa`
1. Deploy the application: `kubectl -n myapp run theapp --image=quay.io/whatever/theapp:0.42 --serviceaccount=thesa`