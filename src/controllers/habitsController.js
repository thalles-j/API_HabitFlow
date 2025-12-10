import { prisma } from '../db.js';
import dayjs from 'dayjs';

export async function createHabit(req, res) {
  try {
    const { title, weekDays, monthlyDay, specificDate, timeStart, timeEnd } = req.body;

    if (!title || (!weekDays?.length && !monthlyDay && !specificDate)) {
      return res.status(400).json({ message: 'Missing title or frequency configuration' });
    }

    let creationDate = dayjs().startOf('day');

    // Logic: If recurring and timeStart has passed today, start from tomorrow
    if (!specificDate && timeStart) {
      const [hours, minutes] = timeStart.split(':').map(Number);
      const now = dayjs();
      const habitTimeToday = dayjs().hour(hours).minute(minutes);

      if (now.isAfter(habitTimeToday)) {
        creationDate = creationDate.add(1, 'day');
      }
    }

    const habitData = {
      title,
      created_at: creationDate.toDate(),
      user_id: req.userId,
      time_start: timeStart,
      time_end: timeEnd,
    };

    if (weekDays && weekDays.length > 0) {
      habitData.weekDays = {
        create: weekDays.map(weekDay => ({ week_day: weekDay })),
      };
    }

    if (monthlyDay) {
      habitData.monthly_day = monthlyDay;
    }

    if (specificDate) {
      habitData.specific_date = dayjs(specificDate).startOf('day').toDate();
    }

    const habit = await prisma.habit.create({
      data: habitData
    })

    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create habit', details: err.message });
  }
}

export async function deleteHabit(req, res) {
  try {
    const { id } = req.params;

    await prisma.habit.delete({
      where: {
        id: id,
      }
    });

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete habit', details: err.message });
  }
}

export async function toggleHabit(req, res) {
  try {
    const id = req.params.id;
    const { date } = req.body; // Expect date in body

    let toggleDate;
    if (date) {
      toggleDate = dayjs(date).startOf('day').toDate();
    } else {
      toggleDate = dayjs().startOf('day').toDate();
    }

    let day = await prisma.day.findUnique({
      where: {
        date: toggleDate,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: toggleDate,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }

    // Check if day is completed
    const weekDay = dayjs(toggleDate).get('day');
    const monthDay = dayjs(toggleDate).date();

    const possibleHabitsCount = await prisma.habit.count({
      where: {
        user_id: req.userId,
        created_at: { lte: toggleDate },
        OR: [
          { weekDays: { some: { week_day: weekDay } } },
          { monthly_day: monthDay }
        ]
      }
    });

    const completedHabitsCount = await prisma.dayHabit.count({
      where: { day_id: day.id }
    });

    const isCompleted = possibleHabitsCount > 0 && completedHabitsCount === possibleHabitsCount;

    await prisma.day.update({
      where: { id: day.id },
      data: { completed: isCompleted }
    });

    res.status(200).json({ isCompleted });
  } catch (err) {
    res.status(400).json({ error: 'Failed to toggle habit', details: err.message });
  }
}

export async function listHabits(req, res) {
  const habits = await prisma.habit.findMany({
    where: {
      user_id: req.userId,
    },
    include: {
      weekDays: true,
    }
  })
  res.json(habits)
}

export async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const { title, weekDays, monthlyDay, specificDate, timeStart, timeEnd } = req.body;

    if (!title || (!weekDays?.length && !monthlyDay && !specificDate)) {
      return res.status(400).json({ message: 'Missing title or frequency configuration' });
    }

    // Prepare update data
    const updateData = {
      title,
      time_start: timeStart,
      time_end: timeEnd,
      monthly_day: monthlyDay || null,
      specific_date: specificDate ? dayjs(specificDate).startOf('day').toDate() : null,
    };

    // Transaction to handle weekDays update (delete old, create new)
    await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      await tx.habit.update({
        where: { id },
        data: updateData,
      });

      // 2. Update WeekDays if provided
      if (weekDays) {
        // Remove all existing weekDays for this habit
        await tx.habitWeekDays.deleteMany({
          where: { habit_id: id },
        });

        // Create new weekDays
        if (weekDays.length > 0) {
          await tx.habitWeekDays.createMany({
            data: weekDays.map(weekDay => ({
              habit_id: id,
              week_day: weekDay,
            })),
          });
        }
      }
    });

    res.status(200).json({ message: 'Habit updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update habit', details: err.message });
  }
}

/**
 * EXEMPLO DE TRANSAÇÃO COMPLEXA
 * Cria múltiplos hábitos e marca progresso em lote de forma atômica
 */
export async function batchCreateHabitsWithProgress(req, res) {
  try {
    const { habits, markAsCompleted } = req.body;
    // habits: Array<{ title, weekDays, monthlyDay, specificDate, timeStart, timeEnd }>
    // markAsCompleted: { date: string, habitIndexes: number[] }

    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return res.status(400).json({ message: 'Habits array is required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdHabits = [];
      const toggleDate = markAsCompleted?.date 
        ? dayjs(markAsCompleted.date).startOf('day').toDate()
        : dayjs().startOf('day').toDate();

      // 1. Criar todos os hábitos
      for (const habitInput of habits) {
        const { title, weekDays, monthlyDay, specificDate, timeStart, timeEnd } = habitInput;

        if (!title || (!weekDays?.length && !monthlyDay && !specificDate)) {
          throw new Error(`Invalid habit: ${title || 'no title'}`);
        }

        let creationDate = dayjs().startOf('day');

        if (!specificDate && timeStart) {
          const [hours, minutes] = timeStart.split(':').map(Number);
          const now = dayjs();
          const habitTimeToday = dayjs().hour(hours).minute(minutes);

          if (now.isAfter(habitTimeToday)) {
            creationDate = creationDate.add(1, 'day');
          }
        }

        const habitData = {
          title,
          created_at: creationDate.toDate(),
          user_id: req.userId,
          time_start: timeStart,
          time_end: timeEnd,
        };

        if (weekDays && weekDays.length > 0) {
          habitData.weekDays = {
            create: weekDays.map(weekDay => ({ week_day: weekDay })),
          };
        }

        if (monthlyDay) {
          habitData.monthly_day = monthlyDay;
        }

        if (specificDate) {
          habitData.specific_date = dayjs(specificDate).startOf('day').toDate();
        }

        const habit = await tx.habit.create({
          data: habitData,
          include: {
            weekDays: true,
          }
        });

        createdHabits.push(habit);
      }

      // 2. Se markAsCompleted foi fornecido, marcar progresso
      let dayRecord = null;
      const completedHabits = [];

      if (markAsCompleted && markAsCompleted.habitIndexes?.length > 0) {
        // Criar ou buscar o dia
        dayRecord = await tx.day.findUnique({
          where: { date: toggleDate },
        });

        if (!dayRecord) {
          dayRecord = await tx.day.create({
            data: { date: toggleDate, completed: false },
          });
        }

        // Marcar hábitos selecionados como concluídos
        for (const index of markAsCompleted.habitIndexes) {
          if (index >= 0 && index < createdHabits.length) {
            const habitToComplete = createdHabits[index];

            const existingDayHabit = await tx.dayHabit.findUnique({
              where: {
                day_id_habit_id: {
                  day_id: dayRecord.id,
                  habit_id: habitToComplete.id,
                }
              }
            });

            if (!existingDayHabit) {
              await tx.dayHabit.create({
                data: {
                  day_id: dayRecord.id,
                  habit_id: habitToComplete.id,
                }
              });

              completedHabits.push(habitToComplete.id);
            }
          }
        }

        // Verificar se o dia ficou 100% completo
        const weekDay = dayjs(toggleDate).get('day');
        const monthDay = dayjs(toggleDate).date();

        const possibleHabitsCount = await tx.habit.count({
          where: {
            user_id: req.userId,
            created_at: { lte: toggleDate },
            OR: [
              { weekDays: { some: { week_day: weekDay } } },
              { monthly_day: monthDay }
            ]
          }
        });

        const completedHabitsCount = await tx.dayHabit.count({
          where: {
            day_id: dayRecord.id,
            habit: {
              user_id: req.userId,
            }
          }
        });

        const isCompleted = possibleHabitsCount > 0 && completedHabitsCount === possibleHabitsCount;

        await tx.day.update({
          where: { id: dayRecord.id },
          data: { completed: isCompleted }
        });
      }

      return {
        createdHabits,
        completedHabits,
        dayCompleted: dayRecord?.completed || false,
      };
    });

    res.status(201).json({
      message: 'Habits created and progress marked successfully',
      ...result,
    });

  } catch (err) {
    res.status(400).json({ 
      error: 'Transaction failed', 
      details: err.message 
    });
  }
}
