import { Router } from 'express';
import { 
  createHabit, 
  toggleHabit, 
  listHabits, 
  deleteHabit, 
  batchCreateHabitsWithProgress,
  updateHabit 
} from '../controllers/habitsController.js';

const router = Router();

router.post('/', createHabit);
router.post('/batch', batchCreateHabitsWithProgress);
router.patch('/:id/toggle', toggleHabit);
router.put('/:id', updateHabit);
router.get('/', listHabits);
router.delete('/:id', deleteHabit);

export default router;

