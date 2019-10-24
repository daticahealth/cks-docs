# Datica CKS Documentation

This is the documentation project for Datica's Compliant Kubernetes Service (CKS).

### How to use these docs

*For comments, feedback and bugs, please create an issue.*

If you're just wanting to write or edit documentation you can do that in the `source/sections` directory. All documentation is written in markdown. For brand new articles to show up, you'll need to add the file path to the `index.html.erb` file in the `source` directory. The order in which articles show is based on their order in this file, so please keep that in mind.

*Note:* All files show up automatically in the left nav. `h1` tags should not be used. `h2` tags indicate new guides, like `Getting started`. `h3` tags are subsections of the guides. `h4` tags can be used, but they do not show up in the left nav.

### How to view the docs locally

If you'd like to view the docs locally, run the following commands:

- `$ cd cks-docs`
- `$ bundle install`
- `$ rake run`
- The site should be running at http://localhost:2113/