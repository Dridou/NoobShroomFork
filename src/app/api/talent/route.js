// app/api/talent/route.js

import { NextResponse } from 'next/server';
import prisma from "@/utils/connect";

// POST: Sauvegarder les talents
export async function POST(req) {
	try {
	  const body = await req.json();
	  const { dungeon, threshold, configData } = body;

	  // Rechercher le donjon et le seuil
	  const dungeonRecord = await prisma.dungeon.findFirst({
		where: { name: dungeon },
	  });

	  if (!dungeonRecord) {
		return NextResponse.json({ error: 'Dungeon not found' }, { status: 404 });
	  }

	  const thresholdRecord = await prisma.threshold.findFirst({
		where: {
		  value: parseInt(threshold, 10),
		  dungeonId: dungeonRecord.id,
		},
	  });

	  if (!thresholdRecord) {
		return NextResponse.json({ error: 'Threshold not found' }, { status: 404 });
	  }

	  // Vérifier si une configuration pour ce donjon et ce seuil existe déjà
	  const existingConfig = await prisma.talentConfig.findFirst({
		where: {
		  dungeonId: dungeonRecord.id,
		  thresholdId: thresholdRecord.id,
		},
	  });

	  let savedConfig;
	  if (existingConfig) {
		// Mettre à jour la configuration existante
		savedConfig = await prisma.talentConfig.update({
		  where: { id: existingConfig.id },
		  data: { configData: configData },
		});
	  } else {
		// Créer une nouvelle configuration
		savedConfig = await prisma.talentConfig.create({
		  data: {
			dungeonId: dungeonRecord.id,
			thresholdId: thresholdRecord.id,
			configData: configData,
		  },
		});
	  }

	  return NextResponse.json(savedConfig);
	} catch (error) {
	  console.error('Error saving talent configuration:', error);
	  return NextResponse.json({ error: 'Error saving talent configuration' }, { status: 500 });
	}
  }



// GET: Charger les talents
export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const dungeonName = searchParams.get('dungeon');
	const thresholdValue = parseInt(searchParams.get('threshold'), 10);

	try {
	  // Rechercher le donjon par son nom
	  const dungeonRecord = await prisma.dungeon.findFirst({
		where: { name: dungeonName },
	  });

	  if (!dungeonRecord) {
		return NextResponse.json({ message: 'Dungeon not found' }, { status: 404 });
	  }

	  // Rechercher le seuil (threshold) associé au donjon
	  const thresholdRecord = await prisma.threshold.findFirst({
		where: {
		  value: thresholdValue,
		  dungeonId: dungeonRecord.id,
		},
	  });

	  if (!thresholdRecord) {
		return NextResponse.json({ message: 'Threshold not found' }, { status: 404 });
	  }

	  // Rechercher la configuration des talents pour le donjon et le seuil donnés
	  const talentConfig = await prisma.talentConfig.findFirst({
		where: {
		  dungeonId: dungeonRecord.id,
		  thresholdId: thresholdRecord.id,
		},
	  });

	  if (!talentConfig) {
		return NextResponse.json({ message: 'Talent configuration not found' }, { status: 404 });
	  }

	  return NextResponse.json(talentConfig);
	} catch (error) {
	  console.error('Error loading talent configuration:', error);
	  return NextResponse.json({ error: 'Error loading talent configuration' }, { status: 500 });
	}
  }

