### Pod Security Policies
CKS supports enabling the PodSecurityPolicies admission controller. PodSecurityPolicies provide a way for cluster administrators to define a set of security criteria that a pod must meet in order to be accepted by the system. These include things like restricting the users a container can run as, allowing different types of volume mounts (secrets, configmaps, hostPath, etc.), and using the host network. A full list of available controls can be found [here](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#what-is-a-pod-security-policy).

CKS creates a default PodSecurityPolicy that is bound to all ServiceAccounts, meaining any Pod can use it out of the box. The default PSP requires that all containers run as non-root, and does not allow privileged containers or any special capabilities, like CAP_NET_ADMIN. Any pod that meets these criteria will be admitted automatically without additional configuration. Pods that do not match the default criteria will need to be explicitly granted permission to use a PSP that allows the required priviledges. To use a PSP, a pod's ServiceAccount needs to be granted the `use` verb on the PSP resource [via RBAC](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#via-rbac).

A pod that is allowed to use multiple PSPs will follow [this policy order](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#policy-order) to choose between them. Once a pod is created, its PSP will not change. The pod does not get permissions from all PSPs that it is allowed to use, it selects one PSP and must conform to its rules in order to be admitted to the cluster. This can cause some unexpected behavior in certain situations when a pod has implicit requirements not specified in the initial pod YAML.

For instance, if a pod is allowed to use the default and privileged policies and the image runs as root, then it should be assigned the privileged policy. However, if the pod does not explicitly define that it wants to run as root by setting `runAsUser: 0`, and has no other requirements that disqualify default,then it will be admitted under the default policy. When this happens the pod will be created, but the container will fail with the error CreateContainerConfigError because it has violated the rules of its PSP. In order to use the correct PSP, the pod would need to either explicitly define the user it will run as, or request some other elevated permission that would force the pod to be admitted under the privileged policy (such as mounting a host path, or running a privileged container).

PodSecurityPolicies are an advanced security feature of Kubernetes, and were orignally not enabled by default in CKS. As of the September 2020 CKS release, newly built clusters will have this feature enabled by default. If you are having issues getting custom workloads to run on your cluster see the [FAQs](#pod-security-policy-faqs) section. If the PSPs are currently disabled for your existing cluster, you can enable them for your CKS cluster by reaching out to Datica Support by submitting a ticket through the [Platform dashboard](https://product.datica.com). We will enable the feature on your staging cluster first, and enable it in production when you indicate that you are ready.

#### Pod Security Policy FAQs

**Q:** I run a workload in my cluster that runs as `root` within a container, or specify a priveleged securityContext and am getting the following warning event message from the pod that runs this container:

```bash
Error: container has runAsNonRoot and image will run as root
```

**A:**
*Option A (Recommended):*
Don't run images in your cluster as the root user or with privileged access. There are countless security reasons to not run your images as the root user. There are many good blogs & articles about why this is, and how to run any container as non-root, [this blog](https://americanexpress.io/do-not-run-dockerized-applications-as-root/) encompasses those points pretty well.

*Option B:*
If you must run your workload as root for some reason, you can use a PSP to do so. If not specified, your workload will always run with the `default` Pod Security Policy. Therefore, any limitations put into that policy will have to be adhered to in order to run on the cluster. You can view the policy directly by running the following command: `kubectl describe psp default`. In order to make your workload compliant you need to run it using a serviceaccount that a role bound to it that allows it to run as root. CKS clusters are automatically configured with a couple useful PSPs that can be used by workloads on your cluster. You can see all of the PSPs deployed onto the cluster by running `kubectl get psp`. For this specific use-case you probably want to use the `privileged` PSP. In order to create the serviceaccount and role you want attached to your workload, see this [example role](https://github.com/daticahealth/k8s-example/blob/master/templates/role.yaml). You will want to update all of the templated variables to match up with the purpose/name of your workload as well as change the `resourceNames:` value to match the PSP you want to use(in this case, `privileged`). You can apply those objects, then all you need to do is modify the workload itself to run with a `ServicAaccountName`, another example of that is [here](https://github.com/daticahealth/k8s-example/blob/master/templates/deployment.yaml#L33). After the change is applied to the workload, it should now comply with all policies and start running.

**Q:** I run a workload in my cluster that runs with the setting `hostNetwork: true` within a container, the workload will not start and am getting a similar warning event message below related to this workload:

```bash
Error creating: pods "<POD-NAME>" is forbidden: unable to validate against any pod security policy: [spec.securityContext.hostNetwork: Invalid value: true: Host network is not allowed to be used spec.containers[0].hostPort: Invalid value: <PORT>: Host port <PORT> is not allowed to be used. Allowed ports: []]
```

**A:**
*Option A (Recommended):*
Avoid using the hostnetwork altogether, there are little to no valid usecases where using the hostnetwork is actually required outside of the Datica managed kubernetes system or administrative component workloads.

*Option B:*
If you must run your application with `hostnetwork:True` for some reason, you can use a PSP to do so. For this specific use-case you probably want to use the `privileged-host-network` PSP. In order to create the serviceaccount and role you want attached to your workload, see this [example role](https://github.com/daticahealth/k8s-example/blob/master/templates/role.yaml). You will want to update all of the templated variables to match up with the purpose/name of your workload as well as change the `resourceNames:` value to match the PSP you want to use (in this case, `privileged-host-network`). You can apply those objects, then all you need to do is modify the workload itself to run with `ServicAaccountName` matching the service account you created, another example of that is [here](https://github.com/daticahealth/k8s-example/blob/master/templates/deployment.yaml#L33). After the change is applied to the workload, it should now comply with all policies and start running.
