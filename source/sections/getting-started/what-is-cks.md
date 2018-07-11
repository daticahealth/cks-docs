### What is CKS?

Everyone is excited about Kubernetes, [including us](https://datica.com/blog/datica's-gone-native-cloud-native/)! Datica is proud to offer a secure, compliant Kubernetes managed service with CKS (short for Compliant Kubernetes Service).

CKS stands for "Compliant Kubernetes Service". CKS is a managed Kubernetes service — which is a service that can be defined in a number of different ways. In the most basic form, a managed Kubernetes service assumes management of the control plane, a group of controllers that take care of routine tasks to ensure the desired state of the cluster matches the observed state. Because Kubernetes can be configured and deployed in a number of different ways, users are often confused about how to setup and manage a Kubernetes cluster. It is because of this problem that managed Kubernetes service providers exist. The biggest players in this space are the three large cloud service providers, Google Cloud Platform, Amazon Web Services, and Microsoft Azure. As Kubernetes adoption increases, so too is the need for a secure, compliant version of Kubernetes. Because much of compliance is tied to lower level security configurations, the need to manage the control plane is ever present in a world where compliance is present.

Although AWS's Elastic Container Service for Kubernetes (EKS) product recently became eligible for HIPAA compliance, that doesn't necessarily mean it is compliant. In order to ensure a cluster is defensibly compliant, a user would have to have develop a clear definition of everything the product does to ensure compliance (in a signed legal agreement) as well as have a BAA in place with the service provider. The only other option is for the user to be responsible for the configuration of the underlying cluster, the operating system that runs the cluster and the instances the operating systems lives on. The big cloud providers will provide sufficient descriptions and possibly even sign a BAA, but gaps remain. Configuring logging, monitoring, intrusion detection, networking, an operating system, as well as a whole slew of infrastructure level configurations defeats the purpose of a managed service — the primary benefit of a managed Kubernetes service is that a customer doesn't have to worry about such components or their intended configurations. If you're working within a regulated industry like healthcare you have almost zero efficient options when it comes to using Kubernetes — either you manage the control plane, the operating system and the underlying infrastructure to maintain the flexibility required for compliance, or you risk falling out of compliance by using a managed service (because they don't provide the configuration flexibility to achieve compliance).

This is where Datica's CKS comes in. In addition to managing the control plane, Datica also configures the underlying operating system (and manages it in perpetuity), configures the underlying instances — and installs, configures and manages a set of deployments required for compliance. These deployments include logging, monitoring, intrusion detection and antivirus software. In addition to the technical configuration, Datica assumes the liability for the complete stack in our BAA, something not available or possible with any other managed Kubernetes offering. CKS delivers a compliant managed Kubernetes service that functions like any other Kubernetes cluster, but one that comes pre-configured for compliance out of the box.


Below is a brief slide deck on CKS. These slides go over why we built a Kubernetes offering and the support and services associated with this new product. In addition, they give an overview of the Datica managed deployments and the shared responsibility model (what you do vs. what we do). This slide deck is not intended to replace the rest of the getting started guide, rather to reinforce the concepts we'll discuss later on.

If you have questions while viewing the slides please read on throughout the rest of the guide as they will likely be answered in later sections.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/AM4hBy1SalVT5X" allowfullscreen></iframe>

To better understand CKS, it will help to briefly review Datica's Legacy Platform product. In the world of cloud computing there are a number of different paths that lead to running and managing workloads. Whether you're building a complex data processing application that performs sentiment analysis, or you're a startup with a basic monolithic application that helps doctor offices schedule better — you will at some point make a decision around how you're going to manage these pieces of software (and likely several times over throughout the course of their lifecycles).

The path of least resistance to the cloud has traditionally involved utilizing a Platform as a Service (PaaS). A PaaS allows users to focus on application development, rather than the repetitive, lower-level tasks of managing workloads on a server. [We've written extensively about PaaS offerings](https://datica.com/blog/kubernetes-vs-paas/) and encourage users to read through these articles.

In 2014 when Datica built it's first product we did so with the assumption that PaaS was the future of application development and management in the cloud. While that turned out to be true to a certain extent, concepts like containerization and projects like Kubernetes have disrupted that thinking. Software has become too complex for PaaS. Organizations are growing and their use cases require more flexibility. As a result of this shift, Datica embarked on creating a compliant Kubernetes offering in late 2017.

Our goals for CKS were straight forward:

- (For application developers) ensure CKS functions just as any other Kubernetes cluster.
- Have no vendor lock-in, offer CKS as a cross-cloud solution.
- Map Kubernetes controls to HITRUST and fill in the gaps with managed deployments.
- Ensure all CKS clusters are continuously compliant through real-time configuration monitoring.

From December 2017 to May 2018 this is what we focused on building. CKS officially went generally available on June 1. Since then we've been accepting new customers as well as helping current Legacy PaaS customers migrate. If you are currently a Datica customer on our Legacy PaaS product and would like to learn more about migration, [please see this section of the docs](TODO).

In our list of goals, we've achieved the following so far:

**Functionality:** CKS functions just as any other Kubernetes cluster. 95% of what Datica adds in terms of compliance and security happens behind the scenes.

**Architecture:** We've architected CKS to have no vendor lock-in. It currently works on AWS and we'll soon be working on porting CKS to Azure. We expect to have both Azure and Google Cloud Platform availability in early 2019.

**HITRUST:** We've mapped HITRUST controls to Kubernetes functionality and configuration while providing additional tooling for logging, monitoring, intrusion detection, vulnerability scanning and more as Datica managed deployments.

**Continuous Compliance:** We've also completed writing a set of verification checks that continuously monitor the running state of each cluster. This work will provide us with a base to build better visibility into the security and compliance of the system. This visibility will be released as a new product — Datica's Cloud Compliance Management System (CCMS). The CCMS will function as a compliance dashboard for CKS clusters. We currently do not have a timeline for the CCMS dashboard. However, major backend functionality is in progress.
