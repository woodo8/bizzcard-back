import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        version: '1.0.0',
        title: 'Bizzcard',
        description: 'Apis for bizzcard.uz',
    },
    host: process.env.URL,
    tags: [ 
        {
            name: 'Users', 
            description: 'This routes are used for user actions', 
        },
        {
            name: 'Auth', 
            description: 'This routes are used for authorization', 
        },
        {
            name: 'Cards', 
            description: 'This routes are used for actions with Business(Bizz) cards', 
        },
    ],
};


const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js']

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc).then(async () => {
    await import('./index.js'); 
});