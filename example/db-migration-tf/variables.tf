variable "aws_profile" {
  type    = string
  default = null
}

variable "permissions_boundary_arn" {
  type = string
}

variable "rds_access_secret_id" {
  type = string
}

variable "rds_security_group_id" {
  type = string
}

variable "prefix" {
  type = string
  default = null
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "subnet_ids" {
  type = list(string)
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "vpc_id" {
  type    = string
  default = null
}
