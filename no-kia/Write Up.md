Flag `{BSIDES-GLOBAL-FLAGS}`

This flag is in several parts 
## binwalk

first is a file `3210.jpg`

```shell
$ binwalk 3210.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
1084574       0x108C9E        QNX IFS

```

## steghide
`binwalk` indicates that there is additional data in the jpeg that isn't just the image data we can use `steghide` to attempt to extract the additional data - we'll try using a blank password
```shell
$ steghide extract -sf 3210.jpg 
Enter passphrase: 
wrote extracted data to "info.zip".

```

Next we will attempt unzip `info.zip`
```shell
$ unzip info.zip 
Archive:  info.zip
   creating: info/
  inflating: info/chatlog.txt        
 extracting: info/important-docs.zip 
```

## Decoding the cipher
```shell
$ cat info/chatlog.txt 
Neo:

3 444 3 0 999 666 88 0 44 33 2 777 0 9 44 2 8 0 8 44 33 0 66 33 9 0 7777 999 7777 2 3 6 444 66 0 7777 2 444 3 0 8 44 33 0 7 2 7777 7777 9 666 777 3 0 333 666 777 0 8 44 33 0 3 666 222 88 6 33 66 8 0 9999 444 7 0 9 2 7777 0

---

Trinity: 

999 33 2 44 0 444 8 7777 0 333 666 555 555 666 9 8 44 33 9 44 444 8 33 777 2 22 22 444 8 0 2 555 555 0 555 666 9 33 777 0 222 2 7777 33 0 66 666 0 7777 7 2 222 33 7777

—

Neo: 

4 777 33 2 8 0 8 44 2 8 7777 0 9 666 777 55 33 3 0 8 44 2 66 55 7777 0

```

The chat log appears to be encoded with `multitap encode` - think _old school texting_ if you're old enough - this can be decoded using the [multitap cipher from dcode.fr](https://www.dcode.fr/multitap-abc-cipher)

```
Neo:
DID YOU HEAR WHAT THE NEW SYSADMIN SAID THE PASSWORD FOR THE DOCUMENT ZIP WAS
---
Trinity:
YEAH ITS FOLLOWTHEWHITERABBIT ALL LOWER CASE NO SPACES
-
Neo:
GREAT THATS WORKED THANKS
```

Next we attempt to unzip the file using the password recovered from the chat log `followthewhiterabbit`:

## Unzipping grandad's files

```shell
$ unzip info/important-docs.zip 
Archive:  info/important-docs.zip
   creating: important_docs/
[info/important-docs.zip] important_docs/email-id2091234.html password: 
  inflating: important_docs/email-id2091234.html  
  inflating: important_docs/TPS-report.doc  
  inflating: important_docs/2021-sales-figs.csv  
   creating: important_docs/grandad/
  inflating: important_docs/grandad/grandads-passwords.txt  
 extracting: important_docs/grandad/grandads-file.zip  
  inflating: important_docs/2020-sales-figs.csv 
```

This zip file has a bunch of _fluff_ looking files, but a folder called grandad - with a zip file and `grandads-file` and `grandads-passwords.txt`

examining the text file shows some passwords - most interestingly `zipfile`
```shell
$ cat important_docs/grandad/grandads-passwords.txt 
Password : Account
reapply8-monotype-deniable : Facebook
amid3-unease-wow : Hotmail
playgroup-quantum9-zombie : Amazon
armband9-virus-plot : Netflix
paragraph-varying-handwoven1 : zipfile

```

using this password , we unzip the final zip file 
```shell
$ unzip important_docs/grandad/grandads-file.zip 
Archive:  important_docs/grandad/grandads-file.zip
   creating: grandads-files/
[important_docs/grandad/grandads-file.zip] grandads-files/Wales.jpg password: 
  inflating: grandads-files/Wales.jpg  
  inflating: grandads-files/Scotland.png  
 extracting: grandads-files/flag.txt  
  inflating: grandads-files/US.jpg 
```

and cat the flag

```shell
$ cat grandads-files/flag.txt 
{BSIDES-GLOBAL-FLAGS}

```