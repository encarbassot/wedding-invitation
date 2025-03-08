import fs from "fs-extra"
import path from "path"

const CONFIG_TABLE = "db-config"

// TODO
// - when change schema, update existing records with defaults or nulls

export default class JsonDB {
  constructor(config,filename="database.json"){
    this.filePath = path.resolve(filename)
    this.config = config
    this._loadDatabase()
    this._updateSchema()
  }

// Load or create database file
_loadDatabase() {
  if (!fs.existsSync(this.filePath)) {
    this.db = { CONFIG_TABLE: this.config };
    this._saveDatabase();
  } else {
    this.db = fs.readJsonSync(this.filePath);
  }
}

// Update schema if new fields are added
_updateSchema() {
  const existingSchema = this.db[CONFIG_TABLE] || {};
  let schemaUpdated = false;

  for (const table in this.config) {
    if (!existingSchema[table]) {
      existingSchema[table] = this.config[table];
      schemaUpdated = true;
    } else {
      for (const field in this.config[table]) {
        if (!existingSchema[table][field] || JSON.stringify(existingSchema[table][field]) !== JSON.stringify(this.config[table][field])) {
          existingSchema[table][field] = this.config[table][field];
          schemaUpdated = true;
        }
      }
    }
  }

  if (schemaUpdated) {
    this.db[CONFIG_TABLE] = existingSchema;
    this._saveDatabase();
  }
}


  _saveDatabase(){
    fs.writeJsonSync(this.filePath,this.db,{spaces:2})
  }

  _validateTableData(table,data){
    if(table===CONFIG_TABLE) throw new Error(`Table name '${CONFIG_TABLE}' is reserved`);
    if(!this.db[CONFIG_TABLE][table]) throw new Error(`Table '${table}' is not defined in the schema`);

    const schema = this.db[CONFIG_TABLE][table]
    Object.keys(data).forEach(key=>{
      if(!schema[key]) throw new Error(`Column '${key}' is not defined in the schema for table '${table}'`)
    })
  }

  _validateTable(table){
    if(table===CONFIG_TABLE) throw new Error(`Table name '${CONFIG_TABLE}' is reserved`);
    if(!this.db[CONFIG_TABLE][table]) throw new Error(`Table '${table}' is not defined in the schema`);
  }


  // Helper function to generate the next auto-incremented value
  _getNextAutoIncrement(currentValue, base) {
    if (base === 10) {
      return currentValue + 1;
    } else {
      return (parseInt(currentValue, base) + 1).toString(base).toUpperCase();
    }
  }


  // Helper function to generate auto-incremented values
  _generateAutoIncrement(table, field, type) {
    if (!this.db[table] || this.db[table].length === 0) {
      return type === "number" ? 1 : "1";
    }
    
    const values = this.db[table].map(record => record[field]).filter(value => value !== null);
    if (type === "number") {
      const maxValue = Math.max(...values.map(v => parseInt(v, 10) || 0), 0);
      return this._getNextAutoIncrement(maxValue, 10);
    } else {
      const maxValue = values.reduce((max, val) => (parseInt(val, 36) > parseInt(max, 36) ? val : max), "0");
      return this._getNextAutoIncrement(maxValue, 36);
    }
  }
  
  // Helper function to process and validate a single record
  _processRecord(table, data,autoIncrementTracker={}) {
    this._validateTable(table, data);
    const schema = this.db[CONFIG_TABLE][table];
    let newData = {};

    for (const field in schema) {
      if (schema[field].autoIncrement) {
        // newData[field] = this._generateAutoIncrement(table, field, schema[field].type);
        if (!autoIncrementTracker[field]) {
          autoIncrementTracker[field] = this._generateAutoIncrement(table, field, schema[field].type);
        } else {
          autoIncrementTracker[field] = this._getNextAutoIncrement(autoIncrementTracker[field], schema[field].type === "number" ? 10 : 36);
        }
        newData[field] = autoIncrementTracker[field];
      } else if (data[field] !== undefined) {
        newData[field] = data[field];
      } else if (schema[field].default !== undefined) {
        newData[field] = typeof schema[field].default === "function" ? schema[field].default() : schema[field].default;
      } else if (schema[field].notNull) {
        throw new Error(`Field '${field}' cannot be null.`);
      } else {
        newData[field] = null;
      }
    }

    // Apply onUpdate functions if defined
    for (const field in schema) {
      if (schema[field].onUpdate) {
        newData[field] = schema[field].onUpdate(newData[field]);
      }
    }

    // Check for unique fields
    for (const field in schema) {
      if (schema[field].unique && this.db[table].some(record => record[field] === newData[field])) {
        throw new Error(`Duplicate value for unique field '${field}'.`);
      }
    }

    return newData;
  }

  // Insert a single record or multiple records efficiently
  insert(table, data) {
    if (!this.db[table]) this.db[table] = [];
    const insertData = Array.isArray(data) ? data : [data];
    let autoIncrementTracker = {};

    const newRecords = insertData.map(record => this._processRecord(table, record, autoIncrementTracker));
    this.db[table].push(...newRecords);

    this._saveDatabase();
    return newRecords;
  }

  update(table, data, query) {
    this._validateTableData(table, data);
    if (!this.db[table]) throw new Error(`Table '${table}' does not exist.`);

    let updatedRecords = [];
    this.db[table] = this.db[table].map(record => {
      if (Object.keys(query).every(key => record[key] === query[key])) {
        const updatedRecord = { ...record, ...data };

        // Apply onUpdate functions if defined
        const schema = this.db[CONFIG_TABLE][table];
        for (const field in schema) {
          if (schema[field].onUpdate) {
            updatedRecord[field] = schema[field].onUpdate(updatedRecord[field]);
          }
        }
        updatedRecords.push(updatedRecord);
        return updatedRecord;

      }
      return record;
    });

    if (updatedRecords.length === 0) {
      throw new Error(`No matching records found in '${table}' for query: ${JSON.stringify(query)}`);
    }
    
    this._saveDatabase();
    return updatedRecords;
  }

  // Delete records matching query
  delete(table, query) {
    this._validateTable(table)

    if (!this.db[table]) throw new Error(`Table '${table}' does not exist.`);
  
    //find records to delete
    const recordsToDelete = this.db[table].filter(record =>
      Object.keys(query).every(key => record[key] === query[key])
    );

    // If no matches found, throw an error
    if (recordsToDelete.length === 0) {
      throw new Error(`No matching records found in '${table}' for query: ${JSON.stringify(query)}`);
    }
  
    // Remove matching records
    this.db[table] = this.db[table].filter(record =>
      !Object.keys(query).every(key => record[key] === query[key])
    );

    this._saveDatabase();

    return recordsToDelete;
  }

  // Find all matching records
  find(table, query = {}) {
    this._validateTable(table)
    if (!this.db[table]) return [];
    return this.db[table].filter(record =>
      Object.keys(query).every(key => record[key] === query[key])
    );
  }

  // Find first matching record
  findOne(table, query = {}) {
    this._validateTable(table)
    return this.find(table, query)[0] || null;
  }
}