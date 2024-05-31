API_URL="http://169.254.169.254/latest/api"
TOKEN=`curl -X PUT "$API_URL/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 600"` 
TOKEN_HEADER="X-aws-ec2-metadata-token: $TOKEN"
METADATA_URL="http://169.254.169.254/latest/meta-data"
AZONE=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/placement/availability-zone`
IP_V4=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/public-ipv4`
INTERFACE=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/network/interfaces/macs/ | head -n1`
SUBNET_ID=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/network/interfaces/macs/${INTERFACE}/subnet-id`
VPC_ID=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/network/interfaces/macs/${INTERFACE}/vpc-id`
echo "${IP_V4}"
sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/game.js
sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/start.js
sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/index.js


# sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/game.js
# sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/start.js
# sed -i "s/<EC2_IP>/${IP_V4}/g" /app/frontend/start.js

# if [ ! -z "$COGNITO_USER_POOL_ID" ]; then
sed -i "s/<COGNITO_USER_POOL_ID>/${$COGNITO_USER_POOL_ID}/g" /app/frontend/cognito.js
# fi

# if [ ! -z "$COGNITO_CLIENT_ID" ]; then
sed -i "s/<COGNITO_CLIENT_ID>/${$COGNITO_CLIENT_ID}/g" /app/frontend/cognito.js
# fi



