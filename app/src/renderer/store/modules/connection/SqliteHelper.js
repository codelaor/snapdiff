import DatabaseHelper from './DatabaseHelper';

/**
 * Sqlite database helper
 *
 * @export
 * @class SqliteHelper
 * @implements DatabaseHelper
 */
export default class SqliteHelper extends DatabaseHelper {
  /**
   * Return tables in database
   *
   * @returns {Object[]}          Promise: Array of tables with (optional)
   *                              schema and name properties.
   */
  getTables() {
    return this.knex('sqlite_master')
      .select('name')
      .where('type', 'table')
      .andWhere('name', '<>', 'sqlite_sequence')
      .andWhere('name', '<>', 'sqlite_stat1')
      .orderBy('name');
  }

  /**
   * Returns columns for a given schema/table
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {Object[]}          Promise: Column objects with name property
   */
  getTableColumns(schemaName, tableName) {
    return this.knex.schema.raw(`PRAGMA table_info(${tableName})`)
      // .orderBy('cid')
      .map((row) => ({
        name: row.name,
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
    const results = await this.knex.schema.raw(`PRAGMA table_info(${tableName})`);
    return results
      .filter(row => row.pk)
      .sort((a, b) => a.pk - b.pk)
      .map(row => row.name);
  }
}
