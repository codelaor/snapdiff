/**
 * Abstract class for providing connection-specific helpers for common tasks
 * such as getting the tables in a database etc.
 * @abstract
 * @export
 * @class ConnectionHelper
 */
export default class DatabaseHelper {
  /**
   * Creates an instance of DatabaseHelper.
   *
   * @param {any} knex
   *
   * @memberOf DatabaseHelper
   */
  constructor(knex) {
    this.knex = knex;
  }

  /**
   * Return tables in database
   * @abstract
   *
   * @returns {Object[]}          Promise: Array of tables with (optional)
   *                              schema and name properties.
   * @memberOf DatabaseHelper
   */
  getTables() {
    throw new Error('Application error: Abstract method not overridden');
  }

  /**
   * Returns columns for a given schema/table
   * @abstract
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {Object[]}          Promise: Column objects with name property
   * @memberOf DatabaseHelper
   */
  getTableColumns(schemaName, tableName) {
    throw new Error(
      `Application error: Abstract method not overridden: 
        getTableColumns(${schemaName}, ${tableName})`
    );
  }

  /**
   * Returns primary key fields for a given schema/table
   * @abstract
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {string[]}          Promise: Field names
   *
   * @memberOf DatabaseHelper
   */
  getTablePrimaryKeyFields(schemaName, tableName) {
    throw new Error(
      `Application error: Abstract method not overridden: 
        getTablePrimaryKeyFields(${schemaName}, ${tableName}`
    );
  }
}
