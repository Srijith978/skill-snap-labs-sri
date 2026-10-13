export const FEEDBACK_MAX_WORK_LENGTH = 12000;
export const FEEDBACK_MAX_GOAL_LENGTH = 600;

export const feedbackInputIsValid = (work: string, goal: string): boolean =>
  work.trim().length >= 20 &&
  work.trim().length <= FEEDBACK_MAX_WORK_LENGTH &&
  goal.length <= FEEDBACK_MAX_GOAL_LENGTH;

export const reviewPayload = (skill: string, work: string, goal: string) => ({
  skill,
  work: work.trim(),
  goal: goal.trim(),
});