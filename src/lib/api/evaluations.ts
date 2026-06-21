import { api } from './client';

export type Evaluation = {
  id: string;
  note: number;
  commentaire: string;
  noteContenu: number;
  notePedagogie: number;
  noteSupports: number;
  noteOrganisation: number;
  recommande: boolean;
  dateEvaluation: string;
  isValidated: boolean;
  formateur: any;
  session: any;
  participant: any;
};

export type CreateEvaluationDto = {
  note: number;
  commentaire?: string;
  noteContenu?: number;
  notePedagogie?: number;
  noteSupports?: number;
  noteOrganisation?: number;
  recommande?: boolean;
  dateEvaluation: string;
  formateurId: string;
  sessionId: string;
  participantId: string;
};

export async function getEvaluations(): Promise<Evaluation[]> {
  return api.get<Evaluation[]>('/evaluations');
}

export async function getEvaluation(id: string): Promise<Evaluation> {
  return api.get<Evaluation>(`/evaluations/${id}`);
}

export async function createEvaluation(dto: CreateEvaluationDto): Promise<Evaluation> {
  return api.post<Evaluation>('/evaluations', dto);
}

export async function updateEvaluation(id: string, dto: Partial<CreateEvaluationDto>): Promise<Evaluation> {
  return api.patch<Evaluation>(`/evaluations/${id}`, dto);
}
