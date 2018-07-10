# Datica CKS Documentation

This is a work in progress project for building out new CKS documentation. CKS is a placeholder for what we're calling our Kubernetes service (since the "Platform" is now Legacy). Once we make a hard decision on the CKS name I'll update this doc.

### How to use these docs

If you're just wanting to write or edit documentation you can do that in the `source/sections` directory. Again, it's a work in progress, so some files may no longer be needed or some might be entirely empty. These are markdown files. All documentation is written in markdown. If you're writing a new article and want it to show up, then you'll need to add it to the `index.html.erb` file in the `source` directory. The order in which articles show is based on their order in this file, so please keep that in mind.

*Note:* All files show up automatically in the left nav. `h1` tags should not be used. `h2` tags indicate new guides, like `Getting started`. `h3` tags are subsections of the guides. `h4` tags can be used, but they do not show up in the left nav.

### How to view the docs locally

If you'd like to view the docs locally, run the following commands:

- `$ cd cks-docs`
- `$ bundle install`
- `$ rake run` (yes, I am actually using Rake for this project, don't judge me)
- The site should be running at http://localhost:2113/
