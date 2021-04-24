#!/bin/bash
DIR=$(dirname $0)

# --------------------------------
# run-migrations.sh
#
# This sript creates the needed dynamodb
# tables to run this project
#
# You can run the migrations on any Dynamodb instance
# either in Amazon or inside docker using dynamodb-local
#
# NOTE:
#  Please end your "DYNAMODB_TABLES_PREFIX" with an underline
#  example:
#    DYNAMODB_TABLES_PREFIX=forum_
#
# --------------------------------
# USAGE
#
# Local
# AWS_REGION=localhost DYNAMODB_TABLES_PREFIX=test1_ DYNAMODB_ENDPOINT=http://localhost:49158 ./run-migrations.sh
#
# Amazon
# AWS_REGION=... DYNAMODB_TABLES_PREFIX=..._ AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... ./run-migrations.sh
# --------------------------------

# --------------------------------
# Check environment variables
#
# Required variables:
#  DYNAMODB_TABLES_PREFIX= # ATTENTION: End your string WITH underline (msforum_)
#
# Dynamodb-local (docker)
#  AWS_REGION=localhost
#  DYNAMODB_ENDPOINT=http://docker-container:8000
#
# Dynamodb on Amazon
#  AWS_REGION=
#  AWS_ACCESS_KEY_ID=
#  AWS_SECRET_ACCESS_KEY=
#
# --------------------------------

if [ -z "$AWS_REGION" ]; then
  echo "Missing AWS_REGION"
  exit 1
fi

if [ -z "$DYNAMODB_TABLES_PREFIX" ]; then
  echo "Missing DYNAMODB_TABLES_PREFIX"
  exit 1
fi

ALL_TABLES=""

local_healthcheck () {
  if [ -z "$DYNAMODB_ENDPOINT" ]; then
    echo "[local_healthcheck] Missing DYNAMODB_ENDPOINT"
    exit 1
  fi

  ALL_TABLES=$(aws dynamodb list-tables --endpoint-url="$DYNAMODB_ENDPOINT")
}

local_migrate_categories () {
  TABLE_NAME="${DYNAMODB_TABLES_PREFIX}categories"
  TABLE_ATTR="AttributeName=id,AttributeType=S AttributeName=createdAt,AttributeType=S AttributeName=parentId,AttributeType=S"
  TABLE_KEY="AttributeName=id,KeyType=HASH"

  if [[ $ALL_TABLES == *"$TABLE_NAME"* ]]; then
    echo "Table $TABLE_NAME already exists. Skipping..."
    return 0
  fi

  ## Create Table
  # https://docs.aws.amazon.com/cli/latest/reference/dynamodb/create-table.html
  ## AWS_PAGER
  # https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html
  AWS_PAGER="" aws dynamodb create-table \
    --endpoint-url "$DYNAMODB_ENDPOINT" \
    --table-name "$TABLE_NAME" \
    --attribute-definitions $TABLE_ATTR \
    --key-schema $TABLE_KEY \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=Project,Value=BHO \
    --global-secondary-indexes \
      "[
        {
          \"IndexName\": \"WithParentId\",
          \"KeySchema\": [
              {
                  \"AttributeName\": \"parentId\",
                  \"KeyType\": \"HASH\"
              },
              {
                  \"AttributeName\": \"createdAt\",
                  \"KeyType\": \"RANGE\"
              }
          ],
          \"Projection\": {
              \"ProjectionType\": \"INCLUDE\",
              \"NonKeyAttributes\": [
                  \"title\"
              ]
          },
          \"ProvisionedThroughput\": {
              \"ReadCapacityUnits\": 1,
              \"WriteCapacityUnits\": 1
          }
        }
      ]"
}

local_migrate_posts () {
  TABLE_NAME="${DYNAMODB_TABLES_PREFIX}posts"
  TABLE_ATTR="AttributeName=id,AttributeType=S AttributeName=categoryId,AttributeType=S"
  TABLE_KEY="AttributeName=id,KeyType=HASH"

  if [[ $ALL_TABLES == *"$TABLE_NAME"* ]]; then
    echo "Table $TABLE_NAME already exists. Skipping..."
    return 0
  fi

  TABLE_CATEGORIES="${DYNAMODB_TABLES_PREFIX}categories"
  TABLE_COMMENTS="${DYNAMODB_TABLES_PREFIX}comments"
  TABLE_REACTIONS="${DYNAMODB_TABLES_PREFIX}reactions"

  ## Create Table
  # https://docs.aws.amazon.com/cli/latest/reference/dynamodb/create-table.html
  ## AWS_PAGER
  # https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html
  AWS_PAGER="" aws dynamodb create-table \
    --endpoint-url "$DYNAMODB_ENDPOINT" \
    --table-name "$TABLE_NAME" \
    --attribute-definitions $TABLE_ATTR \
    --key-schema $TABLE_KEY \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=Project,Value=BHO \
    --global-secondary-indexes \
      "[
        {
          \"IndexName\": \"WithCategoryId\",
          \"KeySchema\": [
              {
                  \"AttributeName\": \"categoryId\",
                  \"KeyType\": \"HASH\"
              }
          ],
          \"Projection\": {
              \"ProjectionType\": \"INCLUDE\",
              \"NonKeyAttributes\": [
                  \"createdAt\",
                  \"title\"
              ]
          },
          \"ProvisionedThroughput\": {
              \"ReadCapacityUnits\": 1,
              \"WriteCapacityUnits\": 1
          }
        }
      ]"
}

local_migrate_comments () {
  TABLE_NAME="${DYNAMODB_TABLES_PREFIX}comments"
  TABLE_ATTR="AttributeName=id,AttributeType=S AttributeName=postId,AttributeType=S"
  TABLE_KEY="AttributeName=id,KeyType=HASH"

  if [[ $ALL_TABLES == *"$TABLE_NAME"* ]]; then
    echo "Table $TABLE_NAME already exists. Skipping..."
    return 0
  fi

  ## Create Table
  # https://docs.aws.amazon.com/cli/latest/reference/dynamodb/create-table.html
  ## AWS_PAGER
  # https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html
  AWS_PAGER="" aws dynamodb create-table \
    --endpoint-url "$DYNAMODB_ENDPOINT" \
    --table-name "$TABLE_NAME" \
    --attribute-definitions $TABLE_ATTR \
    --key-schema $TABLE_KEY \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=Project,Value=BHO \
    --global-secondary-indexes \
      "[
        {
          \"IndexName\": \"WithPostId\",
          \"KeySchema\": [
              {
                  \"AttributeName\": \"postId\",
                  \"KeyType\": \"HASH\"
              }
          ],
          \"Projection\": {
              \"ProjectionType\": \"ALL\"
          },
          \"ProvisionedThroughput\": {
              \"ReadCapacityUnits\": 1,
              \"WriteCapacityUnits\": 1
          }
        }
      ]"
}

local_migrate_reactions () {
  TABLE_NAME="${DYNAMODB_TABLES_PREFIX}reactions"
  TABLE_ATTR="AttributeName=id,AttributeType=S AttributeName=postId,AttributeType=S"
  TABLE_KEY="AttributeName=id,KeyType=HASH"

  if [[ $ALL_TABLES == *"$TABLE_NAME"* ]]; then
    echo "Table $TABLE_NAME already exists. Skipping..."
    return 0
  fi

  ## Create Table
  # https://docs.aws.amazon.com/cli/latest/reference/dynamodb/create-table.html
  ## AWS_PAGER
  # https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html
  AWS_PAGER="" aws dynamodb create-table \
    --endpoint-url "$DYNAMODB_ENDPOINT" \
    --table-name "$TABLE_NAME" \
    --attribute-definitions $TABLE_ATTR \
    --key-schema $TABLE_KEY \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=Project,Value=BHO \
    --global-secondary-indexes \
      "[
        {
          \"IndexName\": \"WithPostId\",
          \"KeySchema\": [
              {
                  \"AttributeName\": \"postId\",
                  \"KeyType\": \"HASH\"
              }
          ],
          \"Projection\": {
              \"ProjectionType\": \"ALL\"
          },
          \"ProvisionedThroughput\": {
              \"ReadCapacityUnits\": 1,
              \"WriteCapacityUnits\": 1
          }
        }
      ]"
}

amazon_healthcheck () {
  echo "@TODO ~ migration on Amazon DynamoDB is not developed yet"
  exit 1
}


if [ "$AWS_REGION" = "localhost" ]; then
  echo "Using dynamodb-local"
  local_healthcheck
  local_migrate_categories
  local_migrate_posts
  local_migrate_comments
  local_migrate_reactions
else
  # @TODO
  echo "Using Amazon DynamoDB"
  amazon_healthcheck
fi
