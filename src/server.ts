import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import { PostDays } from "./functions/postDays";
import {PostUser } from "./routes/user/Create-user";
import { GetUser } from "./routes/user/Login-user";
import { PostSchedules } from "./routes/schedules/postSchedules";
import { GetSchedules } from "./routes/schedules/getSchedules";
import { GetSchedulesDay } from "./routes/schedules/getSchedules-day";
import authenticatePlugin from "./plugin/authenticate-plugin";
import { ConfirmationLink } from "./routes/schedules/get-confirmation-link";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifyCors,{origin:"*"})
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "scheduleMenager",
            version: "1.0.0",
        },
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

server.register(authenticatePlugin)

server.register(GetSchedules);
server.register(PostUser);
server.register(GetUser);
server.register(GetSchedulesDay)
server.register(PostSchedules);
server.register(ConfirmationLink);

server.listen({port: 3333}).then(() => {
    console.log("Server running!")
})