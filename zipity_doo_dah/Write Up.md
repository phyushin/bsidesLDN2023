
Flag `{ZIPS_ALL_THE_WAY_DOWN}`

## Zipity Doo Dah

This challenge is a little esoteric it's basically just `create a zip file that unzips over and over`:
```bash
#!/bin/bash
# Basic while loop
counter=1
while [ $counter -le 200 ]
do
        unzip -o flag.zip
        ((counter++))
done
echo All done
```




