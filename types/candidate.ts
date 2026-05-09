export type AssessmentLevel = 1 | 2 | 3;

export interface CandidateInfo {
  fullName: string;
  whatsapp: string;
  email: string;
  positionApplied: string;
  domicile: string;
  age: string;
  education: string;
  lastExperience: string;
  source: string;
  assessmentLevel: AssessmentLevel;
  consent: boolean;
}

export interface CandidateSummaryRow {
  candidate_id: string;
  created_at: string;
  full_name: string;
  whatsapp: string;
  email: string;
  position_applied: string;
  domicile: string;
  age: string;
  education: string;
  last_experience: string;
  source: string;
  assessment_level: string;
  disc_type: string;
  disc_fit_score: number;
  iq_score: number;
  iq_fit_score: number;
  combined_score: number;
  combined_category: string;
  final_recommendation: string;
  red_flags: string;
  summary: string;
}
