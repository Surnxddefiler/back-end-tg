const fs = require('fs');
const content = fs.readFileSync('info.json')
const date = JSON.parse(content)

const isAdmin = (id) => {
    for (let i = 0; i < date.admin.length; i++) {
      if (date.admin[i] === id) {
        return true
      }
    }
    return false
  }
module.exports={isAdmin}