# UI

Light: ![](./public/app-light.png)
Dark: ![](./public/app-light.png)

# Architecture

Each file/folder record in the database has the following columns:

- ID
- Name
- Type (folder/file)
- Owner
- Date created
- Date updated
- Dir (the directory containing this file/folder)
- Content (an ID referencing the ID in object storage)

The directory that the user is currently in, is reflected in a URL segment. This enables bookmarking

# Functionality

- Navigation
- Current directory
- Search
- CRUD
- Login, logout : Auth0

Future:

- File/folder sharing & permissions

## Navigation

### Navigation by clicking

Append to the existing breadcrumb

### Navigation by selecting a breadcrumb

Suppose we have a list of breadcrumbs: b0 (or Home), b1, b2, ..., bn. If the user selects some bi, then we simply remove all the breadcrumbs starting at the one right after bi

### Navigation by back & forward arrows in history

Is automatically done by Next.js

### Navigation by explicit URL (i.e. from bookmarks or manual typing, or perhaps file sharing)

First of all, a GET request must always be used. One way to optionally include breadcrumbs is via a flag in query parameters. However, doing so would open the window for malicious users to always do a GET with the breacrumbs flag on a public file/folder. If such a file/folder is famous & frequently accessed by normal users, performance could degrade because of the breadcrumbs overhead that malicious users query. On top of this, breadcrumbs are generated via DB queries.

Secondly, a separation of concerns is always good. In the future, breadcrumbs of a file may be requested independently.

So, it's best to make an entirely different route.
