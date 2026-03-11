# JWT_Exploit
A simple demonstration of the JWT Signature Confusion Exploit
  
  
## What is a JWT Key Confusion Attack?  
A JWT Key Confusion Attack exploits poor algorithm management on JWT validation. In short, a valid JWT is taken, the contents are manipulated, specifically the header's algorithm field is changed, and typically the body is changed to elevate privleges, then the token is resigned with the tampered data and used.  
  
Think of a JWT like an access badge you'd get working at a fancy company. It isn't absolute proof of who you are, but it serves for most tasks like getting in and out of the building - and if the company is lax on security measures... it might be sufficient for far more privleged tasks.  
  
A JWT Key Confusion Attack relies on a system:  
- using JWTs for verification,  
- using an assymmetric algorithm to sign JWTs,  
- not ensuring the proper algorithm is used to verify the JWT.  

The first two are quite likely.  
JWTs (and other web tokens which are also vulnerable to this exploit) are commonly used so that users don't have to login  every-single-time  they switch pages on the same website.  
The two most common algorithms used by JWTs are HS256 (HMAC w/ SHA-256)(symmetric) and RS256 (RSA Signature w/ SHA-256)(asymmetric). HS256 is lighter weight but generally less secure making it popular for internal functions. RS256 is heavier but generally more secure and thus is the defacto JWT signature algorithm.
The third requirement for a JWT Key Confusion attack to occur is now fairly unlikely. This used to be a big problem when it was first discovered in ~2015. Now it's a very simple fix. If this exploit exists in a code base then that code is either really old or put together carelessly. Even so, this exploit still pops up in important systems every now and then.
  
Referring back to the company access badge example - the company made it, it is authentic. Image you took this valid access badge and scraped off the part that read "visitor" and instead wrote in "admin". The badge still looks real since for the most part it is, but it's corrupted. A good security system will require more than just an access badge to mess with important information, but what are the chances that lazy practices haven't taken hold?  
  
JWT Key Confusion Attacks have a very simple defense and should be a thing of the past. Despite this fact it is not that uncommon to find this vulnerability in important systems.  
Many people erroneously assume JWTs are encrypted. They're not! JWTs are merely signed.  
  

## Steps to demonstrate this exploit - run the following commands:  
#### Generate keys  
- openssl genrsa -out keys/private.pem 2048  
- openssl rsa -in keys/private.pem -pubout -out keys/public.pem  
#### Build and run server  
- docker build -t jwt_lab .  
- docker run -it -p 3000:3000 jwt_lab  
It will be running on "http://localhost:3000", no gui will be available  
#### Open a new terminal then run  
-- Open a new terminal --
- pip install pyjwt  
#### Get a valid token  
- curl http://localhost:3000/login  
-- Save the output, this is your valid token --  
###### Go to https://www.jwt.io/ to see your token and decode it - strip {"token":"THIS_IS_THE_TOKEN"}
###### To verify the signature use the public.pem file stripped of "-----BEGIN PUBLIC KEY-----" and "-----END PUBLIC KEY-----".
#### Run your expoit  
- python exploitB.py  
-- Save the output, this is your *evil* token --  
###### Take the JWT you've gotten and bring it back to https://www.jwt.io/, notice the role value?  
###### Use the public.pem file stripped of "-----BEGIN PUBLIC KEY-----" and "-----END PUBLIC KEY-----" to verify the signature.
#### Check your 'evil' token
- curl http://localhost:3000/admin \
- -H "Authorization: Bearer EVIL_TOKEN"  
  
### Results
The server will respond with either a 401 "Invalid token", or "ADMIN ACCESS GRANTED".  
Notice which result comes from using the *evil* token.  
This demonstrates a JWT Key Confusion Attack. Resigning a JWT with altered data will still verify.  


### To clean up
If docker won't shut down with ^c (a known technical difficulty), open a new terminal, run  
- docker ps  
This will give you the container ID. Run  
- docker stop CONTAINER_ID  
  

## Notes  
Notice that there are three exploit.py files. This demonstrates how modern systems have caught up in an attempt at preventing Key Confusion Attacks. While there is nothing inherently wrong with the logic in exploitA.py nor exploitC.py, the PyJWT library has been set up to try and mitigate accidents by developers. If you run either exploit A or C PyJWT will recognize that the algorithm being used to resign doesn't match and will pop up with an error. This isn't server side defense, this is everyday tools being designed to mitigate errors on others' behalf.  
ExploitB avoids this handy feature for our purposes by reading in the public key as raw bytes instead of a parsed RSA key.  


## Environment not working?
  
### Missing dependencies?  
- MacOS instructions -
This program relies on docker, npm, and pip which are all exceedingly easy to install with homebrew. If you don't have homebrew installed it is also exceedingly easy to install and is used by so much that it's worth having.  
Pip now comes with python by default. Npm comes with node by default.  
To install homebrew run:  
- bash  
- /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Then follow any prompts.
NB: "bash" switches your shell to bash if it is not already. Bash (Bourne Again SHell) has been the default shell across many systems and is highly trusted. Recent MacOS versions switched the default to Zsh (Z shell), though both versions are highly similar aside from some syntax and more obscure features.  
  
To install the dependencies, simply run the commands:  
- brew install docker  
- brew install python
- brew install node

### Unsure if you have the dependencies?  
Verify that you have each dependecy installed with the following commands:  
- docker --version  
- pip --version  
- npm --version  
If any come back with "command not found", then it is either not installed or your path is misconfigured.  
  
### Bugs?
Some set ups of python3 require the command "python3" instead of simply "python". If this irritates you to no end it is easy to set an alias. If it doesn't bother you, just run "python3 exploitB.py" instead of "python exploitB.py".  