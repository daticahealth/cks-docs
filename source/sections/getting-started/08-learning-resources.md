### Learning resources

<div class="callout">
  <p>Already familiar with Kubernetes? Feel free to skip this section and jump right to <a href="#basic-prerequisites">Basic Prerequisites</a></p>
</div>

Preparing for Kubernetes can seem daunting on the surface. [Luckily Datica takes care of the hard parts for you](Luckily Datica takes care of the hard parts for you). The biggest effort to end users is figuring out what their deployments look like on Kubernetes. Tactically what that means is you'll need to figure out logical groupings of containers, services, and other components of your application.

While Kubernetes can essentially work however you'd like, and since you can containerize pretty much anything, the lift from a non-Kubernetes deployment model to a Kubernetes-ready deployment model can be fairly light. However, if you're re-architecting, and moving toward a cloud native model — containerized workloads with micro-services automatically orchestrated by Kubernetes, it can be somewhat involved.

The good news is that Kubernetes and containerization has drastically increased in popularity over the last year. The number of resources online are growing daily. This article is intended to give you quality, recommended resources as a starting point for your Kubernetes journey. Each set of resources is broken down by category below.

#### Containerization

Article: [Principles of Container-based Application Design](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/) - in this article, Bilgin Ibryam discusses the seven principles of container-based application design and how you can integrate those into your development process.

White-paper: [Principles of Container-based Application Design](https://www.redhat.com/cms/managed-files/cl-cloud-native-container-design-whitepaper-f8808kc-201710-v3-en.pdf) - this is the accompanying white-paper to the article above. This paper goes into more detail on the seven principles.

Article: [Developing on Kubernetes](https://kubernetes.io/blog/2018/05/01/developing-on-kubernetes/) - in this article, Michael Hausenblas and Ilya Dmitrichenko discuss approaching Kubernetes development as a software developer. The authors walk you through various CI/CD tools and approaches, with several hands on examples that you can try. This is a great article for those looking for a better understanding of how cloud native applications are deployed and kept up to date.

#### Working with Kubernetes

Once you've containerized your application and or made the necessary architectural changes, the next step is to start working with Kubernetes directly. The very first step in that process is getting a cluster stood up:

- **The simple way:** By far the easiest way to get a working cluster up is by install minikube locally on your machine. Minikube is a single-node Kubernetes cluster that requires almost no configuration and is the path of least resistance to start using Kubernetes.
- **The hard way:** If you're looking to really learn how Kubernetes works, this guide is one of the best resources available. It goes into intricate detail on getting a cluster stood up and configured.

**Note: Both options above are for getting a handle on Kubernetes, not getting a compliant Kubernetes cluster up and running. Once you're ready for production, you will work with Datica to get a compliant cluster stood up. The above recommendations are for local testing purposes only.**

After you've got a cluster stood up using one of the three options above, the next step is start deploying and playing around with the Kubernetes internals. By far the most important step in this process is figuring out how to map your architecture to the various concepts within Kubernetes. Those important concepts include:

**Deployments**

Deployments help users manage replicated pods by allowing for easy modification of configuration. Having control over this configuration allows for Kubernetes to manage updates between application versions, and maintenance of historical events.

[More information on Deployments »](https://v1-9.docs.kubernetes.io/docs/concepts/workloads/controllers/deployment/)

**Pods**

Pods are the smallest unit of scheduling in the world of Kubernetes. Pods typically contain a number of tightly coupled containers. These containers typically share a common network or perhaps a specific configuration. Pods are almost always created via Deployments in Kubernetes.

[More information on Pods »](https://v1-9.docs.kubernetes.io/docs/concepts/workloads/pods/pod/)

**StatefulSets**

StatefulSets are specialized pod controllers that allow for better control over stable and unique network identifiers, persistent storage, graceful deployments and scaling. The primary use case for StatefulSets is in managing databases and persistent storage objects within Kubernetes.

[More information on StatefulSets »](https://v1-9.docs.kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

**DaemonSets**

Like StatefulSets, DaemonSets are specialized pod controllers that allow for an instance of a pod to run on a set of specified nodes. Datica uses DaemonSets for managing logging, monitoring and other compliance related tooling.

[More information on DaemonSets »](https://v1-9.docs.kubernetes.io/docs/concepts/workloads/controllers/daemonset/)

**Other Resources**

- [Kubectl cheat sheet](https://v1-9.docs.kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [CNCF recorded events](https://www.cncf.io/community/recorded-events/)
- [CNCF youtube channel](https://www.youtube.com/channel/UCvqbFHwN-nwalWPjPUKpvTA)
