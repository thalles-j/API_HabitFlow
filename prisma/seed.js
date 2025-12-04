import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean up existing data
  await prisma.dayHabit.deleteMany();
  await prisma.habitWeekDays.deleteMany();
  await prisma.day.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('12345678', 10);

  // 2. Define users and their habits
  const usersData = [
    {
      name: 'Thalles Viana',
      email: 'thalles@gmail.com',
      habits: [
        'Beber Água', 'Ler Livro', 'Exercício', 'Meditar', 'Estudar Code',
        'Dormir 8h', 'Comer Fruta', 'Alongamento', 'Caminhada', 'Limpar Casa'
      ]
    },
    {
      name: 'Giovana Coelho',
      email: 'gio.coelho@gmail.com',
      habits: ['Ir para a academia', 'Estudar', 'Treinar']
    },
    {
      name: 'Gustavo Marques',
      email: 'gustavo@gmail.com',
      habits: ['Jogar', 'Estudar', 'Programação']
    }
  ];

  for (const userData of usersData) {
    // Create User
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: password,
      },
    });
    console.log(`Created user: ${user.email}`);

    const createdHabits = [];

    // Create Habits
    for (const title of userData.habits) {
      const habit = await prisma.habit.create({
        data: {
          title,
          user_id: user.id,
          created_at: new Date('2024-01-01T00:00:00.000Z'),
          weekDays: {
            create: [
              { week_day: 0 }, { week_day: 1 }, { week_day: 2 },
              { week_day: 3 }, { week_day: 4 }, { week_day: 5 }, { week_day: 6 }
            ]
          }
        }
      });
      createdHabits.push(habit);
    }

    // 3. Generate random history for the last 60 days
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0); // Normalize time

      // 30% chance of NOT doing anything that day (simulating missed days)
      if (Math.random() < 0.3) {
        continue; 
      }

      // Upsert Day (ensure day exists)
      const day = await prisma.day.upsert({
        where: { date: date },
        update: {},
        create: { date: date }
      });

      // Randomly complete habits
      for (const habit of createdHabits) {
        // 50% chance to complete a habit on any given day
        if (Math.random() > 0.5) {
          await prisma.dayHabit.create({
            data: {
              day_id: day.id,
              habit_id: habit.id,
            },
          });
        }
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => { await prisma.$disconnect(); });
