import Fastify from "fastify";
import cors from "@fastify/cors";

import { appRoutes } from "./routes";

async function bootstrap() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors);
  await app.register(appRoutes);

  await app.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
