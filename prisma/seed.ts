import { prisma } from "../src/lib/prisma"

async function main() {
  await prisma.cabeleleiros.createMany({
    data: [
      {
        id: "1",
        nome: "João das Tesouras",
        description: "Especialista em cortes masculinos",
      },
      {
        id: "2",
        nome: "Maria das Mechas",
        description: "Colorista profissional",
      }
    ],
  })

  await prisma.tipoServico.createMany({
    data: [
      {
        id: "1",
        nome: "Corte Masculino",
        Preco: 30
      },
      {
        id: "2",
        nome: "Luzes",
        Preco: 90
      }
    ],
  })

  console.log("Dados inseridos com sucesso!")
}

main().finally(() => prisma.$disconnect())
