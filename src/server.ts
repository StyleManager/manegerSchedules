import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { 
    validatorCompiler,
    serializerCompiler,
    jsonSchemaTransform,
    ZodTypeProvider
} from "fastify-type-provider-zod";
import { PostDays } from "./functions/days/postDays";
import {PostUser } from "./routes/user/Create-user";
import { GetUser } from "./routes/user/Login-user";
import { PostSchedules } from "./routes/schedules/postSchedules";
import { GetSchedules } from "./routes/schedules/getSchedule-lists";
import { GetSchedulesHourByDay } from "./routes/schedules/getSchedules-day";
import authenticatePlugin from "./plugin/authenticate-plugin";
import { ConfirmationLink } from "./routes/schedules/get-confirmation-link";
import { GetTypeSchedules } from "./routes/schedules/getTypeSchedules-list";
import { GetHairDresser } from "./routes/schedules/getHairDresser";
import { GetHairDresserHour } from "./routes/schedules/getHairDresserHour";
import { GetHairDresserDay } from "./routes/schedules/getHairDresserDay";
import { GetSchedulesDayByHour } from "./routes/schedules/getSchedules-hour";

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

server.register(GetHairDresser);
server.register(GetSchedules);
server.register(GetUser);
server.register(GetTypeSchedules);
server.register(GetSchedulesHourByDay);
server.register(GetSchedulesDayByHour);
server.register(PostUser);
server.register(PostSchedules);
server.register(ConfirmationLink);
server.register(GetHairDresserHour)
server.register(GetHairDresserDay)

server.listen({port: 3333, host: '0.0.0.0'}).then(() => {
    console.log(`Server running in 3333`)
})