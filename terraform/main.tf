terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.1"
    }
  }
  required_version = ">= 1.2.0"
}
provider "aws" {
  region = "us-east-1"
}

# VPC configuration
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Subnet configuration
resource "aws_subnet" "subnet1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route" "internet_route" {
  route_table_id         = aws_route_table.main.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.subnet1.id
  route_table_id = aws_route_table.main.id

}

resource "aws_security_group" "sg_ec2" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # HTTP frontend
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # HTTP backend
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance with User Data for startup scripts
resource "aws_instance" "ec2" {
  ami                         = "ami-080e1f13689e07408"
  instance_type               = "t2.micro"
  key_name                    = "vockey"
  subnet_id                   = aws_subnet.subnet1.id
  vpc_security_group_ids      = [aws_security_group.sg_ec2.id]
  associate_public_ip_address = true


  user_data = <<-EOF
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

sudo git clone https://github.com/pwr-cloudprogramming/a10-Aniakii.git
cd a10-Aniakii/backend/
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker build -t mybackend:v1 -t mybackend:latest .

COGNITO_USER_POOL_ID="${aws_cognito_user_pool.user_pool.id}"
COGNITO_CLIENT_ID="${aws_cognito_user_pool_client.public_client.id}"
BACKEND_URL=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

sudo docker run -e COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID -e COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID -e BACKEND_URL=$BACKEND_URL -p 8080:8080 mybackend

EOF

  user_data_replace_on_change = true

  tags = {
    Name = "CognitoTask"
  }
}

output "public_ip" {
  value = aws_instance.ec2.public_ip
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "ticTacToe"

  password_policy {
    minimum_length                  = 8
    require_uppercase               = true
    require_lowercase               = true
    require_numbers                 = true
    require_symbols                 = true
  }

  deletion_protection = "INACTIVE"

  auto_verified_attributes = ["email"]

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }


  mfa_configuration = "OFF"

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  username_configuration {
    case_sensitive = true
  }

}

resource "aws_cognito_user_pool_client" "public_client" {
  name                = "tic tac toe client"
  user_pool_id        = aws_cognito_user_pool.user_pool.id
  generate_secret     = false

  refresh_token_validity  = 30
  access_token_validity   = 60
  id_token_validity       = 60
  token_validity_units {
    access_token = "minutes"
    id_token     = "minutes"
    refresh_token = "days"
  }

  
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  allowed_oauth_flows_user_pool_client = false

  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation = true
  auth_session_validity = 3
}

