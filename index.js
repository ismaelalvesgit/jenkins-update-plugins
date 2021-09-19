require('dotenv').config()
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const find = require('cheerio-eq');
const readPath = process.env.READ_PATH || './plugins.txt'
const writePath = process.env.WRITE_PATH || './update.txt'

async function execute (){
    const data = fs.readFileSync(readPath, 'utf-8');
    if(data){
        fs.writeFileSync(writePath, '', 'utf-8')
        await Promise.all(data.split('\n').map(async(check)=>{
            let [ plugin, version ] = check.split(':');
            try {
                const request = await axios.default.get(`https://updates.jenkins.io/download/plugins/${plugin}/`);
                const $ = cheerio.load(request.data);
                version = find($, '.artifact-list > li:eq(1)').text().split('\n')[0]
            } catch (error) {
                console.log("Plugin not found:", plugin)
            }
            fs.appendFileSync(writePath, `${plugin}:${version}\n`, 'utf-8')
            return `ok: ${plugin}:${version}`
        }));
        console.log("Update performed successfully")
        process.exit(0)
    }else{
        console.log('This file not found')
    }
}

setImmediate(() =>  execute())