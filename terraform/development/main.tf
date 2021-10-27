provider "aws" {
  region  = "eu-west-2"
  version = "~> 2.0"
}
terraform {
  backend "s3" {
    bucket  = "terraform-state-housing-development"
    encrypt = true
    region  = "eu-west-2"
    key     = "services/tl-housing-processes-frontend/state"
  }
}
resource "aws_s3_bucket" "frontend-bucket-development" {
  bucket = "lbh-tl-housing-processes-frontend-development.hackney.gov.uk"
  acl    = "private"
  versioning {
    enabled = true
  }
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://manage-my-home-development.hackney.gov.uk"]
    expose_headers  = ["x-amz-server-side-encryption","x-amz-request-id","x-amz-id-2"]
    max_age_seconds = 3000
  }
}
module "cloudfront-development" {
  source = "github.com/LBHackney-IT/aws-hackney-common-terraform.git//modules/cloudfront/s3_distribution"
  s3_domain_name = aws_s3_bucket.frontend-bucket-development.bucket_regional_domain_name
  origin_id = "mtfh-tl-housing-processes-frontend"
  s3_bucket_arn = aws_s3_bucket.frontend-bucket-development.arn
  s3_bucket_id = aws_s3_bucket.frontend-bucket-development.id
  orginin_access_identity_desc = "tl-housing processes frontend cloudfront identity"
  cname_aliases = []
  environment_name = "development"
  cost_code= "B0811"
  project_name= "mtfh tl-housing"
  use_cloudfront_cert = true
}
resource "aws_ssm_parameter" "cdn" {
  name  = "/tl-housing/development/processes-app-url"
  type  = "String"
  value = "https://${module.cloudfront-development.cloudfront_domain_name}"
  overwrite = true
}