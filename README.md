# Ferramenta de atualização de plugins via arquivo .txt do jenkins

Este projeto foi criado para automatizar atualização dos plugins 
do jenkins via arquivos .txt utilizando [Node.js](https://nodejs.org/en/).

Feramentas Utilizadas:
* [NodeJs](https://nodejs.org/en/)
* [axios](https://www.npmjs.com/package/axios)
* [cheerio](https://devpleno.com/cheerio)
* [cheerio-eq](https://github.com/watson/cheerio-eq)
* [dotenv](https://www.npmjs.com/package/dotenv)

## Screenshots
code view:
```js
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
```

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Iniciar Projeto
``` sh
npm start
```

## EXTRA
#### 1) Variaveis de ambiente
Existe sommente 2º variaveis de ambiente configuradas no projeto
* READ_PATH = "Utilizada para prover o path do arquivo de leitura dos plugins desatualizados"
* WRITE_PATH = "Utilizada para prover o path do arquivo onde sera provido a listagem dos plugins atualizados"


## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit)

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).
