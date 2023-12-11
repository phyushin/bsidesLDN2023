Flag `{B4S1C_TCP_DUMP_CH4LL3NG3}`

`The worst time you find out your backup is broken is when you need it most`
## Monthly Back...what?
## Forensics

This challenge consists of 2 parts - the first is some wireshark-fu the second is some basic password cracking

Opening the challenge PCAP file users will see a short capture of traffic where the someone visted 
a webserver on port 8080 along with various other bits and bats, following the HTTP stream will show that the user tried to download flag.txt
but oh no! the file is garbled... luckily there's a back up in the same folder ... but that is also corrupt, just goes to show,
the most likely time you find that your back up works is also the worst possible time to discover that it doesn't

These files can be extracted in wireshark using the `File > Export Objects > HTTP` option, it's possible to export all three objects this way
Next, checking the files exported you find that the files `flag.txt` and `backup_2023_11_09.zip` are corrupt but checking `backup_2023_10_09.zip`
it appears to be ok and also contains a `flag.txt` file - only problem is it's password protected...

you can use many different tools to crack the password but if you're lucky you tried `bsides` as a password 


