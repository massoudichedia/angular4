// kanban.interface.ts

export interface KanbanItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  education: string;
  experience: string;
  skills: string[];
  notes?: CandidateNote[];
  evaluation?: Evaluation;
  progress: number; // Supprimez le ? pour rendre obligatoire
  cvUrl?: string;
  appliedDate?: Date;
}
export interface KanbanPhase {
  id: string;
  title: string;
  color: string;       // Couleur principale
  bgColor: string;     // Couleur de fond
  order: number;       // Ordre d'affichage
  isLocked?: boolean;  // Optionnel: pour bloquer la suppression
}
export interface KanbanBoard {
  phases: KanbanPhase[];
  items: KanbanItem[];
}

interface Phase {
  id: number;
  title: string;
  isEditing: boolean;
  candidates: any[];
}


export interface KanbanColumn {
  id: string;
  title: string;
  tickets: KanbanItem[];
}

export interface RecruitmentStep {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  noteType: NoteType;
  order: number;
}

export interface SkillEvaluation {
  skill: string;
  required: number;
  acquired: number;
  comment?: string;
}

export interface Evaluation {
  rating: number;
  comment: string;
  skills: SkillEvaluation[];
  date: Date;
  evaluator?: string;
}

export interface CandidateNote {
  type: NoteType;
  content: string;
  date: Date;
  author?: string;
}

export type NoteType = 
  | 'RH' 
  | 'Technique' 
  | 'Test Technique' 
  | 'Générale' 
  | 'Feedback' 
  | 'Autre';

// Interface pour les statistiques
export interface RecruitmentStats {
  presSelectionne: number;
  rhInterview: number;
  technique: number;
  embauche: number;
  refuse: number;
  total: number;
}

export interface JobDescription {
  title: string;
  technicalSkills: string[];
  transversalSkills: string[];
  requiredExperience?: string;
  educationLevel?: string;
}

