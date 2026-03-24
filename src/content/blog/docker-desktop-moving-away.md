---
title: "Docker Desktop — Moving away"
description: "Docker Desktop is going paid. Here's how to switch to nerdctl or podman on macOS."
date: 2022-01-22
tags: [docker, containers, macos]
---

Docker is changing its licensing model and Docker Desktop will require a subscription starting 31st Jan 2022, more details [here](https://www.docker.com/blog/updating-product-subscriptions/).

Docker Engine provides a runtime for Containers, other popular container runtimes are:

- [Containerd](https://containerd.io/)
- [CRI-O](https://github.com/cri-o/cri-o)
- [Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html)
- [runc](https://github.com/opencontainers/runc)
- [crun](https://github.com/containers/crun)
- [runv](https://github.com/hyperhq/runv)

All container runtimes follow certain set of standards set by [OCI initiative](https://opencontainers.org/).

Next, we need a CLI which can spawn and manage containers using any of OCI Compliant runtimes, here we're exploring below 2 options:

- [nerdctl](https://github.com/containerd/nerdctl)
- [podman](https://github.com/containers/podman)

## Installing nerdctl on macOS

```bash
brew install lima
limactl start
```

Few basic commands:

```bash
# see running containers
lima nerdctl ps

# run a new container
lima nerdctl run nginx

# display details of local images
lima nerdctl images

# building a new image
nerdctl build -t foo /some-dockerfile-directory
```

Commands are similar to `docker` commands, thus you can create an `alias` and continue to use same old `docker` commands.

```bash
alias docker="lima nerdctl"
```

**Note**: `limactl start` will create a ubuntu (default) virtual machine.

You can run commands inside this machine by prefixing commands with `lima` such as:

```bash
lima uname -a
```

When you're done using containers, do `limactl stop` to stop the virtual machine, and `limactl remove default` to remove the image.

## Installing podman on macOS

```bash
brew install podman
podman machine init
podman machine start
```

Few basic commands:

```bash
# see running containers
podman ps

# run a new container
podman run nginx

# display details of images
podman images

# building a new image
podman build -t foo /some-dockerfile-directory
```

As commands are similar to `docker` you can create an alias:

```bash
alias docker="podman"
```

Click [here](https://www.redhat.com/sysadmin/podman-mac-machine-architecture) for more details on `podman`.

**Note**: `podman machine init` downloads a `fedora-coreos` virtual machine image. `podman machine start` will create a virtual machine using qemu virtualisation on macOS.

To cleanup afterwards:

```bash
podman machine stop
podman machine rm
```
