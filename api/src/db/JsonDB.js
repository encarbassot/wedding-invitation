import fs from "fs-extra"
import path from "path"

const CONFIG_TABLE = "db-config"

export default class JsonDB {
  constructor(config,filename="database.json"){
    this.filePath = path.resolve(filename)
    this.config = config
    this._loadDatabase()
  }

  _loadDatabase(){
    if(!fs.existsSync(this.filePath)){
      this.db = {[CONFIG_TABLE]:this.config}
      this._saveDatabase()
    }else{
      this.db = fs.readJsonSync(this.filePath)
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

  // Generate next auto-increment value
  _generateAutoIncrement(table, field, type) {
    if (!this.db[table] || this.db[table].length === 0) {
      return type === "number" ? 1 : "1";
    }
    
    const values = this.db[table].map(record => record[field]).filter(value => value !== null);
    if (type === "number") {
      return Math.max(...values.map(v => parseInt(v, 10) || 0), 0) + 1;
    } else {
      // Convert the last value to hexadecimal and increment
      const maxValue = values.reduce((max, val) => (parseInt(val, 36) > parseInt(max, 36) ? val : max), "0");
      const newNumber = parseInt(maxValue, 36) + 1;
      return newNumber.toString(36).toUpperCase();
    }
  }


  insert(table, data) {
    this._validateTableData(table, data);
    if (!this.db[table]) this.db[table] = [];

    const schema = this.db["db-config"][table];
    let newData = {};

    // Ensure all fields are present and enforce notNull constraint
    for (const field in schema) {
      if (schema[field].autoIncrement) {
        newData[field] = this._generateAutoIncrement(table, field, schema[field].type);
      } else if (data[field] !== undefined) {
        newData[field] = data[field];
      } else if (schema[field].notNull) {
        throw new Error(`Field '${field}' cannot be null.`);
      } else {
        newData[field] = null; // Set to null if not provided
      }
    }

    // Check for unique fields
    for (const field in schema) {
      if (schema[field].unique) {
        if (this.db[table].some(record => record[field] === newData[field])) {
          throw new Error(`Duplicate value for unique field '${field}'.`);
        }
      }
    }

    this.db[table].push(newData);
    this._saveDatabase();
    return newData;
  }

  update(table, data, query) {
    this._validateTableData(table, data);
    if (!this.db[table]) return 0;

    let updatedCount = 0;
    this.db[table] = this.db[table].map(record => {
      if (Object.keys(query).every(key => record[key] === query[key])) {
        updatedCount++;
        return { ...record, ...data };
      }
      return record;
    });
    
    this._saveDatabase();
    return updatedCount;
  }

  // Delete records matching query
  delete(table, query) {
    this._validateTable(table)
    if (!this.db[table]) return 0;
    const initialLength = this.db[table].length;
    this.db[table] = this.db[table].filter(record =>
      !Object.keys(query).every(key => record[key] === query[key])
    );
    this._saveDatabase();
    return initialLength - this.db[table].length;
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