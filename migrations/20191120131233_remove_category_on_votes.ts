import * as Knex from 'knex'


export async function up(knex: Knex): Promise<any> {
  knex.schema.alterTable('votes', table => {
    table.dropColumn('categoryId')
  })
}


export async function down(knex: Knex): Promise<any> {
}

