import { api } from "./client";

export type SessionDocument = {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  sessionId: string;
  uploadedById: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    prenom: string;
    nom: string;
  };
};

export async function getSessionDocuments(sessionId: string): Promise<SessionDocument[]> {
  return api.get<SessionDocument[]>(`/sessions/${sessionId}/documents`);
}

export async function uploadSessionDocument(
  sessionId: string,
  file: File,
): Promise<SessionDocument> {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("access_token");
  const res = await fetch(`http://localhost:3001/api/sessions/${sessionId}/documents/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur lors de l'upload");
  }
  return res.json();
}

export function getDocumentDownloadUrl(sessionId: string, docId: string): string {
  const token = localStorage.getItem("access_token");
  return `http://localhost:3001/api/sessions/${sessionId}/documents/${docId}/download?token=${token}`;
}
