import { api } from './client';

export type Session = {
  id: string;
  dateDebut: string;
  dateFin: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  salle: string;
  cvFormateurUrl: string;
  factureUrl: string;
  bonCommandeUrl: string;
  contratUrl: string;
  nombreParticipants: number;
  isCompleted: boolean;
  isCancelled: boolean;
  notes: string;
  formation: any;
  participants: any[];
  employes: any[];
  formateurs: any[];
  createdAt: string;
  updatedAt: string;
};

export async function getSessions(): Promise<Session[]> {
  return api.get<Session[]>('/sessions');
}

export async function getSession(id: string): Promise<Session> {
  return api.get<Session>(`/sessions/${id}`);
}

export async function createSession(dto: any): Promise<Session> {
  return api.post<Session>('/sessions', dto);
}

export async function updateSession(id: string, dto: any): Promise<Session> {
  return api.patch<Session>(`/sessions/${id}`, dto);
}

export async function deleteSession(id: string): Promise<void> {
  return api.delete(`/sessions/${id}`);
}

export async function enrollInSession(sessionId: string): Promise<Session> {
  return api.post<Session>(`/sessions/${sessionId}/enroll`);
}

export async function getMySessions(): Promise<Session[]> {
  return api.get<Session[]>('/sessions/mine');
}
