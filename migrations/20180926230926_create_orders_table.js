exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('orders', function (table) {
      table.increments('id').primary(),
        table.integer('reservation_id').notNull(),
        table.string('uri').notNull(),
        table.foreign('reservation_id').references('reservations.id')
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('orders', function (table) {
      table.dropForeign('reservation_id')
    }),
    knex.schema.dropTable('orders')
  ])
};
