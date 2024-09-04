dropdb forem-production
createdb forem-production
psql -c "CREATE SCHEMA heroku_ext;" -d forem-production
psql -c "CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA heroku_ext;" -d forem-production
psql -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA heroku_ext;" -d forem-production
psql -c "CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA heroku_ext;" -d forem-production
psql -c "CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA heroku_ext;" -d forem-production
psql -c "CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA heroku_ext;" -d forem-production
pg_restore --verbose --no-acl --no-owner -d forem-production < ./db/backups/heroku-production.20240902.dump
