import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const bilan = await prisma.bilan.create({
  data: {
    humeur: data.humeur,
    anxiete: data.anxiete,
    sommeil: data.sommeil,
    estime: data.estime,
    stress: data.stress,
    trauma: data.trauma,
    burnout: data.burnout,
    critique: data.critique,
    IGDP: data.IGDP,
    niveau: data.niveau,
    dominante: data.dominante,
  },
});

    return Response.json({ id: bilan.id }, { status: 201 });

  } catch (error) {
    console.error("Erreur création bilan:", error);
    return Response.json(
      { error: "Erreur lors de la création du bilan" },
      { status: 500 }
    );
  }
}