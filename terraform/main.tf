terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# VPC
resource "aws_vpc" "aiops_vpc" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "aiops-vpc"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "aiops_cluster" {
  name     = "aiops-eks-cluster"
  role_arn = aws_iam_role.eks_cluster.arn
  
  vpc_config {
    subnet_ids = aws_subnet.eks_subnets[*].id
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# EKS Node Group
resource "aws_eks_node_group" "aiops_nodes" {
  cluster_name    = aws_eks_cluster.aiops_cluster.name
  node_group_name = "aiops-nodes"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.eks_subnets[*].id
  
  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }
  
  instance_types = ["t3.medium"]
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_nodes_policy
  ]
}

# IAM Roles
resource "aws_iam_role" "eks_cluster" {
  name = "aiops-eks-cluster-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role" "eks_nodes" {
  name = "aiops-eks-node-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# S3 Bucket for ML Models
resource "aws_s3_bucket" "ml_models" {
  bucket = "aiops-ml-models-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name = "aiops-ml-models"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 8
}
