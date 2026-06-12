export type Formation = {
  id: string;
  title: string;
  category: string;
  type: "Intra" | "Inter" | "Catalogue";
  duration: string;
  level: "Initiation" | "Intermédiaire" | "Avancé";
  price: number;
  location: string;
  nextDate: string;
  trainer: string;
  seats: number;
  enrolled: number;
  description: string;
  objectives: string[];
  prerequisites: string[];
};

export const formations: Formation[] = [
  {
    id: "lead-equipe-agile",
    title: "Leadership et management d'équipe agile",
    category: "Management",
    type: "Inter",
    duration: "3 jours",
    level: "Intermédiaire",
    price: 1850,
    location: "Paris · Présentiel",
    nextDate: "14 juillet 2026",
    trainer: "Camille Vasseur",
    seats: 12,
    enrolled: 8,
    description:
      "Acquérez les postures et outils essentiels pour fédérer une équipe en environnement agile, gérer les conflits et faire grandir vos collaborateurs.",
    objectives: [
      "Adopter une posture de leader-coach",
      "Animer des rituels agiles efficaces",
      "Conduire des entretiens de feedback",
      "Construire un plan de développement individuel",
    ],
    prerequisites: ["2 ans d'expérience en encadrement", "Connaissance des bases de Scrum"],
  },
  {
    id: "cybersecurite-fondamentaux",
    title: "Cybersécurité — Fondamentaux pour tous",
    category: "IT & Sécurité",
    type: "Catalogue",
    duration: "2 jours",
    level: "Initiation",
    price: 990,
    location: "Distanciel",
    nextDate: "22 juin 2026",
    trainer: "Idriss Bennani",
    seats: 20,
    enrolled: 15,
    description:
      "Comprendre les menaces actuelles, adopter les bons réflexes et protéger vos données professionnelles au quotidien.",
    objectives: [
      "Identifier les principales cybermenaces",
      "Sécuriser ses accès et ses mots de passe",
      "Reconnaître le phishing et l'ingénierie sociale",
      "Réagir face à un incident",
    ],
    prerequisites: ["Usage courant d'un poste de travail"],
  },
  {
    id: "excel-avance",
    title: "Excel avancé — Tableaux de bord & Power Query",
    category: "Bureautique",
    type: "Inter",
    duration: "2 jours",
    level: "Avancé",
    price: 1190,
    location: "Lyon · Présentiel",
    nextDate: "5 août 2026",
    trainer: "Sophie Lambert",
    seats: 10,
    enrolled: 6,
    description:
      "Construisez des tableaux de bord dynamiques, automatisez vos imports de données et gagnez des heures sur vos reportings.",
    objectives: [
      "Maîtriser Power Query et Power Pivot",
      "Concevoir des tableaux de bord interactifs",
      "Automatiser avec les macros",
    ],
    prerequisites: ["Maîtrise des formules Excel intermédiaires"],
  },
  {
    id: "design-thinking",
    title: "Design Thinking & Innovation produit",
    category: "Innovation",
    type: "Intra",
    duration: "4 jours",
    level: "Intermédiaire",
    price: 2450,
    location: "Sur site client",
    nextDate: "10 septembre 2026",
    trainer: "Léa Marchetti",
    seats: 14,
    enrolled: 14,
    description:
      "Une immersion pratique dans la démarche Design Thinking pour faire émerger des solutions centrées utilisateur.",
    objectives: [
      "Mener des entretiens utilisateurs",
      "Cadrer un problème avec la méthode HMW",
      "Prototyper et tester rapidement",
    ],
    prerequisites: ["Aucun"],
  },
  {
    id: "rgpd-conformite",
    title: "RGPD & Conformité des données",
    category: "Juridique",
    type: "Catalogue",
    duration: "1 jour",
    level: "Initiation",
    price: 650,
    location: "Distanciel",
    nextDate: "30 juin 2026",
    trainer: "Maître Hugo Renault",
    seats: 25,
    enrolled: 19,
    description:
      "Comprendre les obligations RGPD, cartographier vos traitements et mettre en place une gouvernance simple.",
    objectives: [
      "Maîtriser les fondamentaux du RGPD",
      "Tenir un registre des traitements",
      "Répondre aux demandes des personnes concernées",
    ],
    prerequisites: ["Aucun"],
  },
  {
    id: "prise-parole",
    title: "Prise de parole en public — Impact & Présence",
    category: "Soft skills",
    type: "Inter",
    duration: "2 jours",
    level: "Intermédiaire",
    price: 1290,
    location: "Bordeaux · Présentiel",
    nextDate: "18 juillet 2026",
    trainer: "Antoine Delcourt",
    seats: 8,
    enrolled: 5,
    description:
      "Développez votre aisance, structurez vos messages et marquez durablement votre auditoire.",
    objectives: [
      "Travailler voix, posture et regard",
      "Structurer un pitch en 3 minutes",
      "Gérer le trac et les questions difficiles",
    ],
    prerequisites: ["Aucun"],
  },
];

export const trainers = [
  { name: "Camille Vasseur", expertise: "Management & Leadership", rating: 4.9, sessions: 42, city: "Paris" },
  { name: "Idriss Bennani", expertise: "Cybersécurité", rating: 4.8, sessions: 35, city: "Lyon" },
  { name: "Sophie Lambert", expertise: "Data & Bureautique", rating: 4.9, sessions: 58, city: "Lyon" },
  { name: "Léa Marchetti", expertise: "Design & Innovation", rating: 4.7, sessions: 24, city: "Marseille" },
  { name: "Maître Hugo Renault", expertise: "Juridique & RGPD", rating: 4.8, sessions: 19, city: "Paris" },
  { name: "Antoine Delcourt", expertise: "Soft skills & Communication", rating: 4.9, sessions: 47, city: "Bordeaux" },
];

export const categories = [
  "Management",
  "IT & Sécurité",
  "Bureautique",
  "Innovation",
  "Juridique",
  "Soft skills",
];