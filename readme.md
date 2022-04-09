
# FRANQ

## API Rest para filtro de notícias 

<br />

### Documentação do projeto

### Como fazer chamadas para a API?

### Filtrando uma única notícia

```javascript
const axios = require('axios');

// Faça a requisição utilizando axios ou qualquer outro
// passando como parâmetros:
// id: 1, -> Number
axios.get(`/noticia/${id}`)
    .then(function (response) {
        // handle success
        response: {
                apiVersion: '1.0',
                timestamp: Number,
                content: {
                    NoticiaModel
                }
        }
    })
    .catch(function (error) {
        // handle error. Para mais informações consulte o tópico "Tratamento e modelos de erros" abaixo
        error: {
            apiVersion: '1.0',
            timestamp: Number,
            status: Number,
            message: String,
            errors: {
                id: [ String ]
            }
        }
    })
```

### Filtrando uma quantidade de notícias por paginação

```javascript
const axios = require('axios');

// Faça a requisição utilizando axios ou qualquer outro
// passando como parâmetros:
// page: 0, -> Number, por padrão 0
// amount: 20, -> Number, por padrão 20
axios.get('/noticias', {
        page: 0,
        amount: 20,
    })
    .then(function (response) {
        // handle success
        response: {
                apiVersion: '1.0',
                timestamp: Number,
                amountReturned: Number,
                content: [  // Array de NoticiaModel
                    { NoticiaModel },
                ]
        }
    })
    .catch(function (error) {
        // handle error. Para mais informações consulte o tópico "Tratamento e modelos de erros" abaixo
    })
```

### Filtrando uma quantidade de notícias com filtro

```javascript
const axios = require('axios');

// Faça a requisição utilizando axios ou qualquer outro
// passando como parâmetros:
// page: 0,
// amount: 10,
// query : {
//     author: [1, 2, 3], -> Array of Numbers
//     category: [1, 2, 3], -> Array of Numbers
//     timeToRead: [1, 2, 3], -> Array of Numbers
//     data: {
//         orderType: 'ascending' // Por padrão é decrescente
//         orderBy: 'register', || 'update' // Por padrão é data de atualização
//         minimumDate: timestamp,
//         maximumDate: timestamp
//     },
//     search: {
//         text: "",
//         searchIn: {
//             title: true,
//             shortTitle: false,
//             callText: false,
//             articleUrl: true
//        }
//     }
// }

axios.get('/noticias/query', {
        page: 1,
        amount: 20,
        query: {
            author: [1, 2, 3],
            category: [1, 2, 3],
            timeToRead: [1, 2, 3],
            data: {
                orderType: 'ascending',
                orderBy: 'update',
                minimumDate: 1626496171160,
                maximumDate: 1626896171160
            },
            search: {
                text: "",
                searchIn: {
                    title: true,
                    shortTitle: false,
                    callText: false,
                    articleUrl: true
                }
            }
        }
    })
    .then(function (response) {
        // handle success
        response: {
                apiVersion: '1.0',
                timestamp: Number,
                amountReturned: Number,
                content: [  // Array de NoticiaModel
                    { NoticiaModel },
                ]
        }
    })
    .catch(function (error) {
        // handle error. Para mais informações consulte o tópico "Tratamento e modelos de erros" abaixo
    })
```

### parâmetros para a API
|   propriedade    |   Tipos aceitos          |   Required   | Valor default   |
|-----------------:|:------------------------:|:------------:|-----------------| 
| id               | ``` Number ```           |  True        |                 |
| page             | ``` Number && String ``` |  false       |  0              |
| amount           | ``` Number && String ``` |  false       |  20             |


### parâmetros para Query
|   propriedade    |   Tipos aceitos                   |   Required   | Valor default   |
|-----------------:|:---------------------------------:|:------------:|-----------------| 
| author           | ``` Array of Number ou Number ``` |  false       |  All Values     |
| category         | ``` Array of Number ou Number ``` |  false       |  All Values     |
| timeToRead       | ``` Array of Number ou Number ``` |  false       |  All Values     |
| timeToRead       | ``` Array of Number ou Number ``` |  false       |  All Values     |
| data.orderType   | ``` String "ascending" ou "decreasing"``` | false | ```decreasing``` |
| data.orderBy     | ``` String "update" ou "register"```|  false |  ```register```|
| data.minimumDate | ``` Number ```                    |  false       |  0              |
| data.maximumDate | ``` Number ```                    |  false       |  Actual Date    |


### parâmetros para search
|   propriedade    |   Tipos aceitos                   |   Required   | Valor default   |
|-----------------:|:---------------------------------:|:------------:|-----------------| 
| text             | ``` String ```                    |  false       |  ""             |
| searchIn.title   | ``` Boolean ```                   |  false       |  ``` true ```   |
| searchIn.shortTitle | ``` Boolean ```                |  false       |  ``` false ```  |
| searchIn.callText   | ``` Boolean ```                |  false       |  ``` false ```  |
| searchIn.articleUrl | ``` Boolean ```                |  false       |  ``` false ```  |


### Modelos de dados e resposta
```typescript

Resposta da api:
apiVersion: String,
timestamp: Number,
amountReturned: Number,
totalPages: Number,
totalItens: Number,
content: [ 
    { NoticiaModel },
]

NoticiaModel: {
    idArticle: Number,
    title: String,
    shortTitle: String,
    callText: String,
    content: String,
    extraText: String,
    articleUrl: String,
    linkRef: String,
    imgCover: String,
    updatedDate: Date,
    registerDate: Date,
    idCategory: Number,
    idAuthor: Number,
    timeToRead: Number
}

TagsModel: {
    id: Number,
    title: String,
    value: String,
}

CategoriesModel: {
    id: Number,
    title: String,
}

AuthorsModel: {
    id: Number,
    name: String,
}
```

### Tratamento e modelos de erros
```javascript
Existem dois tipos de erros code 400 ou 500. Cada apresenta um objeto de erro diferente.

Erro status 400
Erro disparado quando há falhas na validação dos dados, normalmente por passagem de parâmetros inválidos.
A resposta da API segue esse modelo abaixo:
{
    apiVersion: String,
    timestamp: Number,
    message: 'Validation fails',
    errors: {
        ["Error location"]: "Yup message of this error"
    }
}

Erro status 500
Erro disparado quando há falhas internas, ou de conexão com o Banco de dados, instabilidades momentâneas no servidor entre outras.
A resposta da API segue esse modelo abaixo:
{
    apiVersion: String,
    timestamp: Number,
    message: 'Interval server error',
    customMessage: String
}

```


### CHANGELOG

**[ATUAL]** Versão 1.12:
 - Corrigido problemas com paginação.


<details>
  <summary>Versões anteriores</summary>

Versão 1.11:
 - Corrigido problemas com requisições com axios.
 - Corrigido problemas com na passagem de parâmetros utilizando axios.


Versão 1.8:
 - Padronizando respostas das listas de tags, categorias e autores para retornarem sempre id ao invés de, respectivamente, idTag, idCategory e idAuthor.

Versão 1.7:
 - Recebendo parâmetros de configuração para a busca

Versão 1.6:
 - Aceitar envio de somente um número ao invés de array

Versão 1.5:
 - Add parâmetro search para buscar por títulos

Versão 1.4:
 - Add rota '/autores' para listar todas as autores

Versão 1.3:
 - Add rota '/categorias' para listar todas as categorias

Versão 1.2:
 - Add rota '/tags' para listar todas as tags

Versão 1.1:
 - Colocando orderType orderBy para, respectivamente, decreasing, register.

Versão 1.0: 
 - Primeira entrega da API
 
</details>
