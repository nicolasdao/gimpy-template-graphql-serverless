const { HttpHandler } = require('graphql-serverless')
const { serveHttp, app } = require('webfunc')
const { makeExecutableSchema } = require('graphql-tools')
const { glue } = require('schemaglue')

const { schema, resolver } = glue()

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolver
})

const graphqlOptions = {
    schema: executableSchema,
    graphiql: true,
    endpointURL: "/graphiql",
    context: {} // add whatever global context is relevant to you app
}

app.use(new HttpHandler(graphqlOptions))

exports.{{entryPoint}} = serveHttp(app.resolve({ path: '/', handlerId: 'graphql' }))