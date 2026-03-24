---
title: "Linux date cheatsheet"
description: "Some quick handy formats that can be used with the date command on Linux."
date: 2022-08-06
tags: [linux, cli]
---

Some quick handy formats that can be used with the `date` command on Linux.

| Format | Description |
|--------|-------------|
| `%d` | Day of month (01..31) |
| `%m` | Month (01..12) |
| `%Y` | Year (4 digits) |
| `%y` | Year (2 digits) |
| `%H` | Hour (00..23) |
| `%M` | Minute (00..59) |
| `%S` | Second (00..60) |
| `%T` | Time (HH:MM:SS) |
| `%p` | AM or PM |
| `%x` | Locale date (mm/dd/yy) |
| `%s` | Epoch time |

## Examples

```bash
date +'%d'
06
```

```bash
date +'%m'
08
```

```bash
date +'%Y'
2022
```

```bash
date +'%m-%d-%Y'
08-06-2022
```

```bash
date +'%m/%d/%Y %H:%M:%S'
08/06/2022 21:12:40
```

```bash
date +'%m/%d/%Y %H:%M:%S %p'
08/06/2022 21:12:28 PM
```

```bash
date +'%x %T %p'
08/06/22 21:11:59 PM
```

Bonus — print current epoch time:

```bash
date +'%s'
1659820538
```

**Reference**: *Chapter 10: Time, The Linux Programming Interface* — [Michael Kerrisk](http://man7.org/mtk/index.html)
