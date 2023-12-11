Flag `{GIT_IGNORE_PLS}`

this challenge is a pretty easy one that involves looking through a repo's git logs and finding and recovering the `secrets.py` from the repo

```bash
$ git log
commit 257aace5ae595f6f7cb378de0752fa6ca0997ec5 (HEAD -> master)
Author: phyushin <phyushin@biosin>
Date:   Sun Dec 3 11:42:25 2023 +0000

    LGTM

commit 3852fe8a088da8d32ab7deb0815f9ccfd629c30e
Author: phyushin <phyushin@biosin>
Date:   Sun Dec 3 11:20:58 2023 +0000

    removed mistakenly uploaded secrets.py

commit 1b85f5e860571eab612b5640c09cd91954e7a55d
Author: phyushin <phyushin@biosin>
Date:   Sun Dec 3 11:18:51 2023 +0000

    initial commit

```
As we can see, the second commit looks to have removed a file `secrets.py`

We can restore this file with the following command 
```bash
$ git checkout 1b85f5e860571eab612b5640c09cd91954e7a55d secrets.py

```

The checkout option of git is given the _initial commit_ id and the file we would like to restore.

In our case `secrets.py`, once this is done it's simply a matter of `$ cat secrets.py` to get the result
```bash
cat secrets.py

secrets = {
    'ssid': 'SPONSOR_FLAG',
    'pw': 'bsideslondon',
    'flag':'{GIT_IGNORE_PLS}'
    }

```