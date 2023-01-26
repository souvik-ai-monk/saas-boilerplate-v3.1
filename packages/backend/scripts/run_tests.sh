#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

flake8

if [ "${CI:-}" = "true" ]
then
  black --config=pyproject.toml --check .
  cov_report="xml:cov/coverage.xml"
else
   black --config=pyproject.toml .
   cov_report=html
fi

./scripts/wait-for-it.sh db:5432

env $(cat .test.env | xargs) python ./manage.py makemigrations --check --dry-run
pytest --cov --cov-config=/app/.coveragerc --cov-report="${cov_report}"


if [ "${CI:-}" = "true" ]
then
   sed -i 's/<source>\/app<\/source>/<source>.\/packages\/backend<\/source>/g' cov/coverage.xml
fi