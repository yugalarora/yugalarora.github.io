---
title: "The magic of argv"
description: "How Linux programs use argv[0] and hard links to perform different functions from the same binary."
date: 2022-11-19
tags: [linux, python, c]
---

Every C-Program must have a function called `main()`, program execution starts from it.

When a program is executed with command line arguments, those are made available to program's `main()` function by 2 arguments:

- 1st argument `argc` of type `int` indicates number of arguments
- 2nd argument `*argv[]` an array of pointers to the command line arguments

The 1st string in `argv` i.e `argv[0]` is the name of program itself.

Many Linux programs use it to their benefit, by creating links to these binaries with different names. They can perform different functions from same program depending on the program that was used to invoke them.

## The experiment

Let's create a small python program `program1` in `/usr/local/bin`:

```bash
cat <<EOF > /usr/local/bin/program1
#!/usr/bin/env python3
from sys import argv
print(argv[0])
EOF

chmod +x /usr/local/bin/program1
```

We use python's `sys` module to print `argv[0]` i.e program's name. Since we created it in `/usr/local/bin` it's already in our `PATH`, we simply execute by typing `program1` on terminal.

Output: `/usr/local/bin/program1`

Now let's create a `hard link` on `program1` with another name `program2`:

```bash
ln /usr/local/bin/program1 /usr/local/bin/program2
```

Now, when we execute `program2` output is `/usr/local/bin/program2`.

Thus the same 3 lines of code print different output depending on calling program.

## Hard links vs soft links

If you noticed, I used `ln` to create a link, this creates a `hard link`. What if I create a soft link with `ln -s`?

```bash
ln -s /usr/local/bin/program1 /usr/local/bin/program3
```

Run `program3` in terminal, output is `/usr/local/bin/program3`. Makes sense, since we used a different program name to invoke it.

If you know how links work in linux:

- `soft` links → are created on file names, can span across different file systems, have different `inode` number, link becomes dangling/unusable once original file is deleted.
- `hard` links → are created on `inode` number thus cannot span across different file systems, continues to work even if original file is deleted.

## Finding real-world examples

Let's check `inode` number for programs we created above using `ls -li`:

```bash
ls -i /usr/local/bin/program1
61573154 /usr/local/bin/program1

ls -i /usr/local/bin/program2
61573154 /usr/local/bin/program2
```

Same `inode` number, since `program2` was a `hard link` on `program1`.

What about `program3`?

```bash
ls -i /usr/local/bin/program3
61575256 /usr/local/bin/program3
```

Different `inode` number, since this was a `soft link`.

With this understanding that `hard links` will have same `inode` number, we try to find such programs in `/usr/bin`:

```python
#!/usr/bin/env python3
import os

if __name__ == "__main__":
    inode_name = {}
    with os.scandir(path="/usr/bin") as entries:
        for entry in entries:
            if entry.is_file():
                inode_name[entry.inode()] = inode_name.get(entry.inode(), []) + [entry.name]
    print(*[v for _, v in inode_name.items() if len(v) > 1], sep="\n")
```

The output is a lot of programs, sharing a few here I was amazed to see:

```
['umask', 'unalias', 'alias', 'wait', 'hash', 'fc', 'read', 'type', 'getopts',
'bg', 'fg', 'cd', 'command', 'jobs', 'ulimit']
['gzcat', 'zcat', 'gunzip']
['readlink', 'stat']
['cksum', 'sum']
```

`cd` and `ulimit` are same program even though both do very separate functions on a Linux system.

## Bonus

When we created a `hard link`, this can also be seen in `stat` object of the file:

```bash
python3 -c "import os;print(os.stat('/usr/local/bin/program1').st_nlink)"

2
```

The `inode` object maintains an `int` attribute `st_nlink` indicating number of links on the file.

## References

- Chapter 6, section 6: *The Linux Programming Interface — Michael Kerrisk*
- [os.scandir](https://docs.python.org/3/library/os.html#os.scandir)
- [os.DirEntry.stat](https://docs.python.org/3/library/os.html#os.DirEntry.stat)
