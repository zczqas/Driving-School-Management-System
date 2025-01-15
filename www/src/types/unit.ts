export interface CourseUnit {
  title: string;
  purpose: string;
  course_id: number;
  id: number;
}

export interface QuizQuestionType {
  id?: number;
  question: string;
  a: string | null;
  b: string | null;
  c: string | null;
  d: string | null;
  e: string | null;
  correct_answer: string | null;
  image: string;
  unit_id: number;
  is_active: boolean;
}
