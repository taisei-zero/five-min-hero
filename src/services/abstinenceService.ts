import { Abstinence } from '../domain/abstinence';
import { loadAbstinence, saveAbstinence } from '../repositories/abstinenceRepository';

export async function initAbstinence(): Promise<Abstinence> {
  return loadAbstinence();
}

export async function setTargetHours(targetHours: number): Promise<Abstinence> {
  const current = await loadAbstinence();
  const next: Abstinence = { ...current, targetHours };
  await saveAbstinence(next);
  return next;
}

export async function resetAbstinence(): Promise<Abstinence> {
  const current = await loadAbstinence();
  const next: Abstinence = { ...current, lastResetAt: new Date().toISOString() };
  await saveAbstinence(next);
  return next;
}
