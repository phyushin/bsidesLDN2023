Flag `{BSIDES-HACK-THE-PLANET}`

Hint: the password 

The pager screen shows braille: 
![char(51)](https://www.dcode.fr/tools/braille/images/char(51).png)![char(33)](https://www.dcode.fr/tools/braille/images/char(33).png)![char(41)](https://www.dcode.fr/tools/braille/images/char(41).png)![char(37)](https://www.dcode.fr/tools/braille/images/char(37).png)![char(62)](https://www.dcode.fr/tools/braille/images/char(62).png)![char(51)](https://www.dcode.fr/tools/braille/images/char(51).png)![char(47)](https://www.dcode.fr/tools/braille/images/char(47).png)![char(39)](https://www.dcode.fr/tools/braille/images/char(39).png)![char(33)](https://www.dcode.fr/tools/braille/images/char(33).png)![char(61)](https://www.dcode.fr/tools/braille/images/char(61).png)![char(49)](https://www.dcode.fr/tools/braille/images/char(49).png)![char(62)](https://www.dcode.fr/tools/braille/images/char(62).png)

This decodes to `HACKTHEPLANET`

```shell
$ steghide extract -sf pager.jpg 
Enter passphrase: 
wrote extracted data to "flag.zip".

```

the flag.zip file is also passworded - so lets try the same password

```shell
unzip flag.zip 
Archive:  flag.zip
[flag.zip] flag password: 
  inflating: flag                    

```

```shell
cat flag
ZRFF JVGU GUR ORFG! QVR YVXR GUR ERFG!
{OFVQRF-UNPX-GUR-CYNARG}

```
looks like we're almost there... but the flag text looks a little off, we can bruteforce the encoding, using cyberchef
it turns out to be ROT13
```
MESS WITH THE BEST! DIE LIKE THE REST!
{BSIDES-HACK-THE-PLANET}
```