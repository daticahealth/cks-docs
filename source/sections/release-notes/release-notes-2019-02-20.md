### February 20, 2019

#### Updates

A major vulnerability that affects CKS has been discovered. You can find details of the vulnerability [here](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-5736). This release is specifically for a fix to CVE-2019-5736 which is handled by updating the version of CoreOS running on all nodes to [1967.6.0](https://coreos.com/releases/#1967.6.0).

Most clusters will be entirely unaffected by this rollout. A notable exception is that pods with stringent memory limits may need to have the limits increased to work with the runc patch. Specifically, we suggest that all pods running on CKS have any memory limits set to 10MB higher than the pod itself needs to support the runc patch.

#### Customer Support:

- In order to tend to your support issue in a timely manner, please submit your ticket through the [Platform dashboard](https://product.datica.com) by clicking on the “Contact Support” button located in the footer of the Environment UI. This provides valuable metadata to the support staff, which allow them to triage the issue much quicker.