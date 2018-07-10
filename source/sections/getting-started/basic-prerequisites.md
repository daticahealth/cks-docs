### Basic Prerequisites

Once you've [established contact](https://datica.com/contact) with Datica, the first step is to work with our sales department on understanding your organization's needs as they pertain to compliance and security in the cloud. This will likely require a few in depth discussions as well as a technical overview of CKS.

From there, we'll put together a contract based on these conversations. Once the contract is signed by both parties, Datica will schedule the provisioning of your new CKS cluster. Because CKS is still a new offering, we require 3-5 days of lead time. Once you're in the queue, our services team will establish contact with your organization and securely request the following information:

- Legal business name (used for certificate generation)
- What you'd like to name your cluster (ex: "Staging01")
- Initial user administrators (a list of emails)
- Your cloud provider [account ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)
- Your cloud provider [access key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
- Your cloud provider [secret key](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)
- Which [region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) you'd like to deploy the cluster
- Which [region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) you'd like for data replication
- Which [region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) you'd like for S3 replication
- S3 bucket name
- A name for you cluster key (ex: "staging01-key")
- An ssh public key file
- Which instances type/size for your nodes (we currently do not support odd instances)

**Note: This account should be created within the "Datica" group. This will ensure any additional services are accessible to us. In addition to the information above, we'll also need root access for the time being.**

Once you've collected the above information and you've set the proper permissions, we'll then need to know:

- How many controller nodes you require (we require a minimum of 3 controllers to ensure HA, you may choose to have more)
- How many workers you require (we deploy 3 by default)
- Which node type/size for your controllers and workers (we currently do not support odd instances and have a minimum requirement of m4.xlarge)

All of this information will be collected via a secure form that we share with you. We do not expect our users to be Kubernetes configuration experts. As a result, a number of concepts may be unfamiliar to you. Not to worry, the Datica services team will be more than happy to walk you through how to properly size and configure your cluster.
