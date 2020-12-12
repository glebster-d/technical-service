'use strict'

const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {

    constructor(args) {

        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        this.path = path.join(userDataPath, args.configName + '.json');
        this.data = parseDataFile(this.path, args.defaults);

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '');
        }
    }

    get(key) {

        return this.data[key];
    }

    set(key, value) {

        this.data[key] = value;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }   
}

function parseDataFile(filePath, defaults) {
    
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } 
    catch(error) {
     
      return defaults;
    }
  }  
  
  
  module.exports = Store;