terraform {
  // terraformのバージョンを指定
  required_version = ">= 1.5.1"

  // awsプロバイダーのバージョンを指定
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
    }
  }
}

// awsプロバイダーの設定
provider "aws" {
  // regionを指定
  region = "ap-northeast-1"
}