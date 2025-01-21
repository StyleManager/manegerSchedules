    import { randomUUID } from "node:crypto";
    import { FastifyTypedInstance } from "../types/fastifyTyped";
    import z from "zod";

    interface user {
        id: string, 
        name: string,
        email: string
    }

    const users: user[] = [];

    export async function Teste(server: FastifyTypedInstance){
        
        server.get("/users", {
            schema: {
                tags: ["users"],
                description: "List user",
                response: {
                    201: z.array(z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string(),
                    }))
                }
            }
        },() => {
            return users;
        })

        server.post("/users", {
            schema: {
                description: "Create new user",
                tags: ["users"],
                body: z.object({
                    name: z.string(),
                    email: z.string().email()
                }),
                response: {
                    201: z.null().describe("User Created"),
                }
            }
        }, async (request, reply) => {
            const {name, email} = request.body

            users.push({
                id: randomUUID(),
                name, 
                email
            });
            return reply.status(201).send();
        })
        
        
    }