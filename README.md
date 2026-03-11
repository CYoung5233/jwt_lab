# JWT_Exploit
A simple demonstration of the JWT Signature Confusion Exploit

## Steps to demonstrate this exploit - run the following commands:  
#### Generate keys  
- openssl genrsa -out keys/private.pem 2048  
- openssl rsa -in keys/private.pem -pubout -out keys/public.pem  
#### Build and run server  
- docker build -t jwt_lab .  
- docker run -it -p 3000:3000 jwt_lab  
It will be running on "http://localhost:3000", though no gui will be available  
##### Open a new terminal  
- pip install pyjwt  
#### Get a valid token  
- curl http://localhost:3000/login  
##### Go to https://www.jwt.io/ to see your token and decode it - strip {"token":"THIS_IS_THE_TOKEN"}
##### To verify the signature use the entire public.pem file.
#### Run your expoit  
- python exploitB.py  
##### Take the JWT you've gotten and bring it back to https://www.jwt.io/, notice the role value?  
##### Use the public.pem file stripped of "-----BEGIN PUBLIC KEY-----" and "-----END PUBLIC KEY-----" to verify the signature.
#### Check your 'evil' token
- curl http://localhost:3000/admin \
- -H "Authorization: Bearer EVIL_TOKEN"  

Result will either be a 401 "Invalid token", or "ADMIN ACCESS GRANTED"


### To clean up
If docker won't shut down with ^c (a known technical difficulty), open a new terminal, run  
- docker ps  
This will give you the container ID. Run  
- docker stop CONTAINER_ID  