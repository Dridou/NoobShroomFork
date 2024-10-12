// app/api/talent/route.js

import { NextResponse } from 'next/server';
import prisma from "@/utils/connect";

// POST: Sauvegarder les talents
export async function POST(req) {
  try {
    const body = await req.json();
    const { characterClass, configData  } = body; // Inclure la classe

    // Rechercher la classe en utilisant le nom
    const classRecord = await prisma.characterClass.findFirst({
      where: {
        name: characterClass, // Vérifier si la classe existe déjà dans la base de données
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: 'Character class not found' }, { status: 404 });
    }


      // Créer une nouvelle configuration pour la classe
      savedConfig = await prisma.talentConfig.create({
        data: {
          classId: classRecord.id, // Lier la configuration à la classe
          configData: configData,  // Enregistrer la configuration des talents
        },
      });

    return NextResponse.json(savedConfig);
  } catch (error) {
    console.error('Error saving talent configuration:', error);
    return NextResponse.json({ error: 'Error saving talent configuration' }, { status: 500 });
  }
}




// GET: Charger les talents
export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const className = searchParams.get('class');
	const buildId = searchParams.get('id'); // Vérifier si un id est passé

	try {
	  if (className) {
		// Rechercher les builds pour la classe
		const classRecord = await prisma.characterClass.findFirst({
		  where: { name: className },
		});

		if (!classRecord) {
		  return NextResponse.json({ message: 'Classe non trouvée' }, { status: 404 });
		}

		const builds = await prisma.talentConfig.findMany({
		  where: { classId: classRecord.id },
		});

		return NextResponse.json(builds);
	  }

	  if (buildId) {
		// Rechercher un build spécifique par son ID
		const talentConfig = await prisma.talentConfig.findUnique({
		  where: { id: buildId },
		});

		if (!talentConfig) {
		  return NextResponse.json({ message: 'Build non trouvé' }, { status: 404 });
		}

		return NextResponse.json(talentConfig);
	  }

	  return NextResponse.json({ message: 'Paramètre manquant' }, { status: 400 });

	} catch (error) {
	  console.error('Erreur lors de la récupération:', error);
	  return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
  }



