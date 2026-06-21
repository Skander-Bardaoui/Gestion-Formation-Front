import { api } from './client';

export type Certificate = {
  id: string;
  numeroCertificat: string;
  dateEmission: string;
  dateExpiration: string;
  statut: 'emis' | 'envoye' | 'telecharge';
  qrCode: string;
  signatureElectronique: string;
  certificatUrl: string;
  noteObtenue: number;
  isValidated: boolean;
  validatedBy: string;
  employe: any;
  formation: any;
  session: any;
};

export async function getCertificates(): Promise<Certificate[]> {
  return api.get<Certificate[]>('/certificates');
}

export async function getCertificate(id: string): Promise<Certificate> {
  return api.get<Certificate>(`/certificates/${id}`);
}
