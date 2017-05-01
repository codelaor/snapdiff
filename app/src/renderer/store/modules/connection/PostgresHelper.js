import DatabaseHelper from './DatabaseHelper';

/**
 * Postgres database helper
 *
 * @export
 * @class PostgresHelper
 * @implements DatabaseHelper
 */
export default class PostgresHelper extends DatabaseHelper {
  /**
   * Return tables in database
   *
   * @returns {Object[]}  Promise: Array of tables with (optional)
   *                      schema and name properties.
   */
  getTables() {
    return this.knex('information_schema.tables')
      .select(['table_schema as schema', 'table_name as name'])
      .where('table_type', 'BASE TABLE')
      .andWhere('table_schema', '<>', 'information_schema')
      .andWhere('table_schema', '<>', 'pg_catalog')
      .orderBy(['schema', 'name']);
  }

  /**
   * Returns columns for a given schema/table
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {Object[]}          Promise: Column objects with name property
   */
  getTableColumns(schemaName, tableName) {
    return this.knex('information_schema.columns')
      .where('table_schema', schemaName)
      .andWhere('table_name', tableName)
      // .orderBy('ordinal_position')
      .map((row) => ({
        name: row.column_name,
      }));
  }

  /**
   * Returns primary key fields for a given schema/table
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {string[]}          Promise: Field names
   *
   */
  async getTablePrimaryKeyFields(schemaName, tableName) {
    const fields = await this.knex.schema.raw(`
      SELECT a.attname as name
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid
                            AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '${schemaName}.${tableName}'::regclass
        AND    i.indisprimary;
    `);
    return fields.rows.map(row => row.name);
  }
}
