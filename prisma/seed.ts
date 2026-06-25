import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@scanskill.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@scanskill.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Scan Skill',
      role: 'ADMIN',
    },
  });

  // Compte agent terrain (rôle USER) pour la consultation sur chantier
  const agentPassword = await bcrypt.hash('agent123', 10);
  await prisma.user.upsert({
    where: { email: 'agent@scanskill.com' },
    update: { password: agentPassword },
    create: {
      email: 'agent@scanskill.com',
      password: agentPassword,
      firstName: 'Agent',
      lastName: 'Terrain',
      role: 'USER',
    },
  });

  const typeHTA = await prisma.typeHabilitation.upsert({
    where: { nom: 'Habilitation électrique HTA' },
    update: {},
    create: { nom: 'Habilitation électrique HTA', description: 'Haute tension A', dureeValidite: '1 an' },
  });

  const typeBT = await prisma.typeHabilitation.upsert({
    where: { nom: 'Habilitation électrique BT' },
    update: {},
    create: { nom: 'Habilitation électrique BT', description: 'Basse tension', dureeValidite: '1 an' },
  });

  const typeHauteur = await prisma.typeHabilitation.upsert({
    where: { nom: 'Travail en hauteur' },
    update: {},
    create: { nom: 'Travail en hauteur', description: 'Port du harnais et travail en hauteur', dureeValidite: '3 ans' },
  });

  const typeSST = await prisma.typeHabilitation.upsert({
    where: { nom: 'SST' },
    update: {},
    create: { nom: 'SST', description: 'Sauveteur Secouriste du Travail', dureeValidite: '2 ans' },
  });

  console.log('Seed terminé');
  console.log('  Admin  : admin@scanskill.com / admin123');
  console.log('  Agent  : agent@scanskill.com / agent123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
