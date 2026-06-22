import { api } from './client';

export type Formateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  qualifications: string;
  specialites: string;
  biographie: string;
  disponibilites: { jour: string; heureDebut: string; heureFin: string }[];
  cvUrl: string;
  noteGlobale: number;
  role: string;
  avatarUrl?: string;
  sessionsAsFormateur: any[];
  evaluationsRecues: any[];
  createdAt: string;
  updatedAt: string;
};

export async function getFormateurs(): Promise<Formateur[]> {
  return api.get<Formateur[]>('/formateurs');
}

export async function getFormateur(id: string): Promise<Formateur> {
  return api.get<Formateur>(`/formateurs/${id}`);
}

export type CreateFormateurDto = {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialites?: string;
  qualifications?: string;
};

export async function createFormateur(dto: CreateFormateurDto): Promise<Formateur> {
  return api.post<Formateur>('/formateurs', dto);
}

export async function updateFormateur(id: string, dto: Partial<CreateFormateurDto>): Promise<Formateur> {
  return api.patch<Formateur>(`/formateurs/${id}`, dto);
}

export async function deleteFormateur(id: string): Promise<void> {
  return api.delete(`/formateurs/${id}`);
}
