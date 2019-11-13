import * as Knex from "knex"


export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`
    ALTER TABLE "categories"
    DROP CONSTRAINT "categories_type_check",
    ADD CONSTRAINT "categories_type_check"
    CHECK (type IN ('TO_USER', 'TO_TWO_USERS', 'TO_USER_WITH_EXTRA', 'ONLY_EXTRA'))
  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.raw(`
    ALTER TABLE "categories"
    DROP CONSTRAINT "categories_type_check",
    ADD CONSTRAINT "categories_type_check"
    CHECK (type IN ('TO_USER', 'TO_TWO_USERS', 'ONLY_EXTRA'))
  `)
}

