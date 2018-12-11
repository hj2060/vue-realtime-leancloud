const fs = require('fs')
const path = require('path')
const output = require(path.join(__dirname, './output.json'))
const dir = fs.readdirSync(__dirname + '/icons')
for (const file of dir) {
    const parse = path.parse(file)
    if(parse.ext === '.svg') {
        const current = fs.readFileSync(__dirname + '/icons/' + file).toString()
        output[parse.name] = {
            width: 1024,
            height: 1024,
            d: []
        }
        const result = current.match(/<path d="([\w\.-\s]*?)"/g)
        for (const item of result) {
            const res = item.match(/<path d="([\w\.-\s]*?)"/)
            output[parse.name].d.push(res[1])
        }
    }
}
const json = JSON.stringify(output, null, 4)
// fs.writeFileSync(path.join(__dirname, '../', 'icons.json'), json)
fs.writeFileSync(path.join(__dirname, 'output.json'), json)