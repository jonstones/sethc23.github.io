---
title: Interactive-Debugging of PL/Python
layout: post
comments: true
---
#### Use an IDE (PyCharm, WingIDE, Eclipse, etc..):
```python
import sys
sys.path.append('/usr/local/lib/python2.7/dist-packages/pycharm-debug.egg')
import pydevd
pydevd.settrace('10.0.1.53', port=50003, stdoutToServer=True, stderrToServer=True)
```
---

#### iPython and ipdb

###### Embed iPython kernel in script (e.g., immediately preceeding a function `f(x)`):
```python
import IPython as I
I.embed_kernel()
```

###### Put ipdb tracer(s) after the kernel call (i.e., inside of `f(x)`):
```python
import ipdb
ipdb.set_trace()
```

###### Execute PL/Pythonu/Python code:
```PLpgSQL
DO LANGUAGE PLPYTHONU
$BODY$
import sys
sys.path.append('/home/ubuntu/tmp.py')
import tmp
reload(tmp)             # resets pgsql cache
tmp.do_something(plpy)  # note plpy as arg
$BODY$;
```

###### If executing the above via command-line (e.g., sqlalchemy, pandas, etc..),standard out may provide the "...connect with --existing kernel-{*kernel pid*}.json" iPython message.  If not, check the newest iPython process `ps -awx | grep ipython`, or check the directory below (or a similar path).

###### Connect to the kernel:
```bash
sudo su postgres
cd /var/lib/postgresql/.local/share/jupyter/runtime
# last bit below assumes a clean runtime directory
ipython console --existing kernel-* && rm *
```

###### Call the `f(x)`.