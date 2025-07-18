import { AssignmentService } from './assignment.service';
import { Assignment } from './assignment.entity';

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    service = new AssignmentService({} as any, {} as any, {} as any);
  });

  it('should calculate remaining days correctly (future end date)', () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2); // started 2 days ago
    const assignment = {
      startDate: startDate.toISOString().slice(0, 10),
      days: 5,
    } as Assignment;
    const remaining = service.calculateRemainingDays(assignment);
    expect(remaining).toBe(3);
  });

  it('should return 0 if treatment is finished', () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10); // started 10 days ago
    const assignment = {
      startDate: startDate.toISOString().slice(0, 10),
      days: 5,
    } as Assignment;
    const remaining = service.calculateRemainingDays(assignment);
    expect(remaining).toBe(0);
  });
}); 