Flag `{ONE_OR_NONE}`


## Actual File
![[main]]

This challenge can be solved by using `gdb` and `peda`

`apt-get install gdb`

```
git clone https://github.com/longld/peda.git ~/peda
echo "source ~/peda/peda.py" >> ~/.gdbinit
echo "DONE! debug your program with gdb and enjoy"
```

And then `gdb main` will load the file up you might have to `chmod +x` the file

```bash
gdb-peda$ r

Starting program: /home/phyu/bsides/Writeups/xordinary/main 
QkJJSUVFICBCQklJRQ==
IS SOMETHING HERE?
[Inferior 1 (process 4702) exited with code 023]
Warning: not running

```

we can look at the assembly of the main function by using the following command
```shell
disass main
```

we can use the addresses in the output to add breakpoints within the application like so, first of all we will add breakpoints to both the calls to `puts@plt` this is where printf function is called 

```
b* 0x00005555555557c5
b* 0x0000555555555827
```

We then use the `r` command to rerun the program and it will break when the print function is called, gdb will break and because we're using peda, it will show the stack: at the point we call printf - as you can see the arg is the same as the first statement 
```shell
arg[0]: 0x555555559280 ("QkJJSUVFICBCQklJRQ==")
[------------------------------------stack-------------------------------------]

0000| 0x7fffffffdff0 --> 0x0 
0008| 0x7fffffffdff8 --> 0x14 
0016| 0x7fffffffe000 --> 0x7ffff7fe4540 (<_dl_fini>:	push   rbp)
0024| 0x7fffffffe008 --> 0x0 
0032| 0x7fffffffe010 --> 0x555555555840 (<__libc_csu_init>:	push   r15)
0040| 0x7fffffffe018 --> 0x555555559260 ("BBIIEE  BBIIE")
0048| 0x7fffffffe020 --> 0x7fffffffe110 --> 0x1 
0056| 0x7fffffffe028 --> 0x0 
[------------------------------------------------------------------------------]

```

to continue to the next breakpoint we can use the `c` command
```
arg[0]: 0x555555556030 ("IS SOMETHING HERE?")
[------------------------------------stack-------------------------------------]
0000| 0x7fffffffdff0 --> 0xd ('\r')
0008| 0x7fffffffdff8 --> 0x14 
0016| 0x7fffffffe000 --> 0x555555556030 ("IS SOMETHING HERE?")
0024| 0x7fffffffe008 --> 0x5555555597e0 ("{ONE_OR_NONE}")
0032| 0x7fffffffe010 --> 0x55555555601b ("GS0nLDoqUl8sLScsGA==")
0040| 0x7fffffffe018 --> 0x555555559260 ("BBIIEE  BBIIE")
0048| 0x7fffffffe020 --> 0x7fffffffe110 --> 0x1 
0056| 0x7fffffffe028 --> 0x0 
[------------------------------------------------------------------------------]

```
the second breakpoint - the flag is on the stack `{ONE_OR_NONE}`

Code:
```C
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

static char encoding_table[] = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                                'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                                'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                                'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                                'w', 'x', 'y', 'z', '0', '1', '2', '3',
                                '4', '5', '6', '7', '8', '9', '+', '/'};
static char *decoding_table = NULL;
static int mod_table[] = {0, 2, 1};
 
void build_decoding_table() {
 
    decoding_table = malloc(256);
    for (int i = 0; i < 64; i++)
        decoding_table[(unsigned char) encoding_table[i]] = i;
}
 
 
void base64_cleanup() {
    free(decoding_table);
} 
 
char *base64_encode(const unsigned char *data,
                    size_t input_length,
                    size_t *output_length) {
    *output_length = 4 * ((input_length + 2) / 3);
 
    char *encoded_data = malloc(*output_length);
    if (encoded_data == NULL) return NULL;
 
    for (int i = 0, j = 0; i < input_length;) {
 
        uint32_t octet_a = i < input_length ? (unsigned char)data[i++] : 0;
        uint32_t octet_b = i < input_length ? (unsigned char)data[i++] : 0;
        uint32_t octet_c = i < input_length ? (unsigned char)data[i++] : 0;
 
        uint32_t triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
 
        encoded_data[j++] = encoding_table[(triple >> 3 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 2 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 1 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 0 * 6) & 0x3F];
    }
 
    for (int i = 0; i < mod_table[input_length % 3]; i++)
        encoded_data[*output_length - 1 - i] = '=';
 
    return encoded_data;
}
 
 
unsigned char *base64_decode(const char *data,
                             size_t input_length,
                             size_t *output_length) {
 
    if (decoding_table == NULL) build_decoding_table();
    if (input_length % 4 != 0) return NULL;
 
    *output_length = input_length / 4 * 3;
    if (data[input_length - 1] == '=') (*output_length)--;
    if (data[input_length - 2] == '=') (*output_length)--;
 
    unsigned char *decoded_data = malloc(*output_length);
    if (decoded_data == NULL) return NULL;
     for (int i = 0, j = 0; i < input_length;) {
        uint32_t sextet_a = data[i] == '=' ? 0 & i++ : decoding_table[data[i++]];
        uint32_t sextet_b = data[i] == '=' ? 0 & i++ : decoding_table[data[i++]];
        uint32_t sextet_c = data[i] == '=' ? 0 & i++ : decoding_table[data[i++]];
        uint32_t sextet_d = data[i] == '=' ? 0 & i++ : decoding_table[data[i++]];
 
        uint32_t triple = (sextet_a << 3 * 6)
        + (sextet_b << 2 * 6)
        + (sextet_c << 1 * 6)
        + (sextet_d << 0 * 6);
 
        if (j < *output_length) decoded_data[j++] = (triple >> 2 * 8) & 0xFF;
        if (j < *output_length) decoded_data[j++] = (triple >> 1 * 8) & 0xFF;
        if (j < *output_length) decoded_data[j++] = (triple >> 0 * 8) & 0xFF;
    }
    return decoded_data;
}

char* XORCipher(char* data, char* key){
	int dataLen = strlen(data);
	int keyLen = strlen(key);

	char* output = (char*)malloc(sizeof(char)* dataLen);
	for (int i = 0; i< dataLen; i++){
		output[i] = data[i] ^ key[i & keyLen];
	}
	return output;
}

char* nothing_suspicious_here = "             \x00"; 
//char* nothing_suspicious_here = "{ONE_OR_NONE}\x00"; /// flay was here but hackers have removed it !!!
char* key = "bsides\x00";

void main(){
	char* cipherText = XORCipher(nothing_suspicious_here, key);
    long output_length = strlen(cipherText);
    
    printf("%s\n",
            base64_encode(cipherText, output_length, &output_length)
        );

    char* b64d = "GS0nLDoqUl8sLScsGA==";
    long input_len = strlen(b64d);
    
    char* fl4g = XORCipher(base64_decode(b64d, input_len, &input_len), key);
    char* test = "IS SOMETHING HERE?";    
    printf("%s\n",
            test
        );        
}

```