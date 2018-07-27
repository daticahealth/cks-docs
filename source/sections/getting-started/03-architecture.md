### CKS architecture

<a href="/assets/img/CKS_Architecture_V2.png" target="_blank">![CKS Architecture Overview](/assets/img/CKS_Architecture_V2.png)</a>

In this section we'll review the CKS architecture and the various components outside of a user's cluster that help Datica maintain compliance and security. Below we cover each component from the diagram above.

#### Cloud accounts

![CKS_Architecture_Accounts](/assets/img/CKS_Architecture_Accounts.png)

The two largest boxes in the diagram include both _Datica's Cloud Account_ and _Customer's Cloud Account_ labels. These correspond to each parties existing cloud account and are intended to represent separate entities (Datica and a third party).

#### clusters

Inside the cloud account boxes there are two darker boxes that correspond to Kubernetes clusters. The one in Datica's Cloud Account is called the _Lighthouse Cluster_ and the one in the customer's cloud account is called _CKS_. We name these clusters differently so it's easier to discuss throughout this guide, but in reality the Lighthouse Cluster _is_ a CKS cluster itself.

The Lighthouse Cluster is a centrally managed CKS cluster that provides Datica with a number of different tools to help manage compliance. Those include:

- **Core API:** Datica's authentication system that manages organizations, users, groups and ACLs;
- **Syndication:** The command center for managing all CKS clusters including making software updates and receiving compliance state information;
- **Vault:** Datica's public key infrastructure responsible for managing encryption across all CKS clusters;
- **Compliance engine:** Responsible for serving the Cloud Compliance Management System, including continuous compliance checks against the cluster's running state;

#### Secure connection

![CKS_Architecture_Connection](/assets/img/CKS_Architecture_Connection.png)

In between the two clusters is a box representing the secure TLS connection between the Lighthouse and every customer cluster managed by Datica. This connection is required to receive real-time compliance information from each CKS cluster. The Lighthouse processes this information and feeds that back into our compliance model to determine if a customer's cluster is compliant or not.

#### Inside a CKS Cluster

![CKS_Architecture_CKS](/assets/img/CKS_Architecture_CKS.png)

A standard CKS cluster is comprised of three controllers and three workers. Datica configures the cluster for high availability to avoid a single point of failure. The compliance deployments — logging, monitoring, intrusion detection, networking, and vulnerability scanning, consuming roughly 8GB of memory on a single worker. However, some of these pods only need to live on a single worker.

Customers will have roughly 40GB of additional memory to allocate to their workloads. Of course, a CKS cluster can handle almost an unlimited number of workers.

#### More information

Below is a brief slide deck on CKS. These slides go over why we built a Kubernetes offering and the support and services associated with this new product. In addition, they give an overview of the Datica managed deployments and the shared responsibility model (what you do vs. what we do). This slide deck is not intended to replace the rest of the getting started guide, rather to reinforce the concepts we'll discuss later on.

If you have questions while viewing the slides please read on throughout the rest of the guide as they will likely be answered in later sections.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/AM4hBy1SalVT5X" allowfullscreen></iframe>

To better understand CKS, it will help to briefly review Datica's Legacy Platform product. In the world of cloud computing there are a number of different paths that lead to running and managing workloads. Whether you're building a complex data processing application that performs sentiment analysis, or you're a startup with a basic monolithic application that helps doctor offices schedule better — you will at some point make a decision around how you're going to manage these pieces of software (and likely several times over throughout the course of their life cycles).

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

**Architecture:** We've architected CKS to avoid vendor lock-in. We currently work with AWS and we look forward to supporting other cloud service providers in the future.

**HITRUST:** We've mapped HITRUST controls to Kubernetes functionality and configuration while providing additional tooling for logging, monitoring, intrusion detection, vulnerability scanning and more as Datica managed deployments.

**Continuous Compliance:** We've also completed writing a set of verification checks that continuously monitor the running state of each cluster. This work will provide us with a base to build better visibility into the security and compliance of the system. This visibility will be released as a new product — Datica's Cloud Compliance Management System (CCMS). The CCMS will function as a compliance dashboard for CKS clusters. We currently do not have a timeline for the CCMS dashboard. However, major backend functionality is in progress.
