import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('Coleção de APIs usadas nos projetos de aoBarbosa')
    .setDescription(
      `Esse é o conjunto de APIs criadas para utilização nos projetos públicos de aoBarbosa, 
toda a API foi criada utilizando o framework [NEST.js](https://nestjs.com/) e armazena os dados em um banco [MongoDB (Atlas)](https://www.mongodb.com/atlas/database).\n\n
Obs.: Todos os projetos foram criados com TypeScript para contar com tipagem forte e ESLint / Prettier para garantir consistência no código.

 ---

# Projetos:
## TaskList\n
[__Disponível aqui__](https://tasklist.aobarbosa.dev/)\n\n
Um projeto simples, para controle de tarefas do dia a dia, criado em React e utilizando tecnologias como Tailwind e Vite.

---

Para ver todos os projetos de aoBarbosa\n\n
[__CLIQUE AQUI__](https://aobarbosa.dev/projects)

---
`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('TaskList')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  Logger.log(`Server is running on port ${process.env.PORT || 3000}`);
  Logger.log(`Url for Swagger [OpenApi]: ${await app.getUrl()}/docs`);
}
bootstrap();
