    import fastifyCors from "@fastify/cors";
    import fastifySwagger from "@fastify/swagger";
    import fastifySwaggerUi from "@fastify/swagger-ui";
    import fastify from "fastify";
    import { validatorCompiler, serializerCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
    import { PostDays } from "./functions/postDays";
    import { GetSchedules } from "./routes/getSchedules";

    // iniciar servidor
    const server = fastify().withTypeProvider<ZodTypeProvider>();

    //integrar fastify com zod
    server.setSerializerCompiler(serializerCompiler);
    server.setValidatorCompiler(validatorCompiler);

    //liberar API para o front
    server.register(fastifyCors,{origin:"*"})
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "scheduleMenager",
                version: "1.0.0",
            }
        }, 
        transform: jsonSchemaTransform,
    })
    server.register(fastifySwaggerUi, {
        routePrefix: "/docs",
    })

    server.addHook("onReady", async () => {
        console.time("Carregando calendario");
            await PostDays();
        console.timeEnd("Carregando calendario");
    })

    server.register(GetSchedules)

    server.listen({port: 3333}).then(() => {
        console.log("Server running!")
    })

  



    