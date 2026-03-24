---
title: "Progress bars in Python with tqdm"
description: "Adding progress bars to your Python scripts is simpler than you think using tqdm."
date: 2021-10-21
tags: [python, cli]
---

I ran a script which processed a large chunk of data, but was not sure what percentage of data has been processed and thought it would be nicer to have a progress bar, adding which was much simpler than I thought using [tqdm](https://github.com/tqdm/tqdm).

In order to access the python library, we need to install it in the python environment, using:

```bash
pip install tqdm
```

Import package into the script:

```python
from tqdm import tqdm
```

And just add the progress bar to your loop:

```python
for i in tqdm(range(100)):
    pass
```

To modify the progress bar:

```python
for i in tqdm(range(100), ascii=True):
    pass
```

Add description:

```python
for i in tqdm(range(100), ascii=True, desc="bar"):
    pass
```

Control width:

```python
for i in tqdm(range(100), ncols=99):
    pass
```

Modify color:

```python
for i in tqdm(range(100), colour="green"):
    pass
```

You can also use a more optimised version of `tqdm(range)` i.e `trange`:

```python
for i in trange(100):
    pass
```

tqdm can also be used as pipes:

```bash
seq 9999999 | wc -l | tqdm
```

Let's create a test directory with arbitrary large number of files:

```bash
mkdir -p test; touch sample{0001..9999}.txt
```

```bash
tar -zcf - test/ | tqdm --bytes --total `du -s test/ | cut -f1` > test.tgz
```

## Resources

- [GitHub - tqdm/tqdm: A Fast, Extensible Progress Bar for Python and CLI](https://github.com/tqdm/tqdm)
- [Python Progress Bar - Stack Overflow](https://stackoverflow.com/questions/3160699/python-progress-bar)
