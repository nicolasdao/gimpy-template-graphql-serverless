const { HttpHandler } = require('graphql-serverless')
const graphqls2s = require('graphql-s2s')
const { serveHttpUniversal, serveHttp, app } = require('webfunc')
const { makeExecutableSchema } = require('graphql-tools')
const { glue } = require('schemaglue')
const { transpileSchema } = graphqls2s

const { schema, resolver } = glue('./src/graphql')

const executableSchema = makeExecutableSchema({
	typeDefs: transpileSchema(schema),
	resolvers: resolver
})

const graphqlOptions = {
	schema: executableSchema,
	graphiql: true,
	endpointURL: '/graphiql',
	context: {} // add whatever global context is relevant to you app
}

app.use(new HttpHandler(graphqlOptions))

eval(serveHttpUniversal(app.resolve({ path: '/', handlerId: 'graphql' })))