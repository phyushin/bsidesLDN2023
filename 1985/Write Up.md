Flag `{ENCODING_IS_NOT_ENCRYPTION}`

Clue `https://youtu.be/K38xNqZvBJI`

This challenge starts with the string:
`AM@.\;(t"!;cP\G=>4Pj=>2U/<^o)=<,56-=&qXf;cPhRAl1]S`

The clue is the Youtube video 1985 which gives you , this suggests the base85 encoding may be involved

base85 decoding the initial string gives us the following:
`e0VOQ09ESU5HX0lTX05PVF9FTkNSWVBUSU9OfQ==`

Which if you've ever done any any CTFs before, you will correctly identify as base64 decoding that yields the flag