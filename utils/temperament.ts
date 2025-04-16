/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question, TemperamentResult, TemperamentType, UserResponse } from "@/types/schema";

// Scores for each dimension
export interface DimensionScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

// Define the question and option interfaces based on the provided data
export interface Option {
  text: string;
  score: {
    E?: number;
    I?: number;
    S?: number;
    N?: number;
    T?: number;
    F?: number;
    J?: number;
    P?: number;
  };
  answer_id?: string; // Added for compatibility with your schema
}

export interface AssessmentQuestion {
  text: string;
  category: string;
  options: Option[];
  pre_course_question_id?: string; // Added for compatibility with your schema
}

// Function to process user responses and calculate temperament type
export const calculateTemperamentType = (
  responses: Array<{ questionId: string; answerId: string }>, 
  questions: AssessmentQuestion[]
): TemperamentType => {
  // Initialize scores for each dimension
  const scores: DimensionScores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  
  // Calculate scores based on responses
  responses.forEach(response => {
    const question = questions.find(q => q.pre_course_question_id === response.questionId);
    if (!question) return;
    
    // Find the selected option by its index (answerId)
    const answerIndex = parseInt(response.answerId);
    const answer = question.options[answerIndex];
    if (!answer) return;
    
    // Add scores for each dimension from the selected answer
    Object.entries(answer.score).forEach(([dimension, score]) => {
      if (dimension in scores && score !== undefined) {
        scores[dimension as keyof DimensionScores] += score;
      }
    });
  });
  
  // Determine type based on highest scores in each dimension pair
  const type = `${scores.E > scores.I ? 'E' : 'I'}${scores.S > scores.N ? 'S' : 'N'}${scores.T > scores.F ? 'T' : 'F'}${scores.J > scores.P ? 'J' : 'P'}` as TemperamentType;
  
  return type;
};

// Simpler version that works directly with the data format from document 1
export const calculateTemperamentTypeFromRawAnswers = (
  selectedAnswers: Array<number>, // Array of selected answer indices (0-3) for each question
  questions: any[] // Raw questions data from document 1
): string => {
  // Initialize scores for each dimension
  const scores: DimensionScores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  
  // Process each answer
  questions.forEach((question, questionIndex) => {
    if (questionIndex >= selectedAnswers.length) return;
    
    const answerIndex = selectedAnswers[questionIndex];
    const selectedOption = question.options[answerIndex];
    
    if (selectedOption && selectedOption.score) {
      // Add up all the dimension scores from this answer
      Object.entries(selectedOption.score).forEach(([dimension, score]) => {
        if (dimension in scores && typeof score === 'number') {
          scores[dimension as keyof DimensionScores] += score;
        }
      });
    }
  });
  
  // Determine type based on highest scores in each dimension pair
  const type = `${scores.E > scores.I ? 'E' : 'I'}${scores.S > scores.N ? 'S' : 'N'}${scores.T > scores.F ? 'T' : 'F'}${scores.J > scores.P ? 'J' : 'P'}`;
  
  console.log("Final scores:", scores);
  console.log("Determined type:", type);
  
  return type;
};

export const getTemperamentDescription = (type: string): TemperamentResult => {
  const temperaments: Record<string, TemperamentResult> = {
    'ISTJ': {
      type: 'ISTJ',
      description: 'Quiet, serious, thorough, dependable, practical, matter-of-fact, logical, and organized.',
      careers: ['Accountant', 'Manager', 'Military Officer', 'Lawyer', 'Judge', 'Doctor', 'Dentist', 'Systems Analyst']
    },
    'ISFJ': {
      type: 'ISFJ',
      description: 'Quiet, friendly, responsible, conscientious, committed, loyal, considerate, and observant.',
      careers: ['Nurse', 'Teacher', 'Healthcare Worker', 'Administrative Manager', 'Interior Designer', 'Social Worker']
    },
    'INFJ': {
      type: 'INFJ',
      description: 'Idealistic, organized, insightful, dependable, compassionate, gentle, and complex.',
      careers: ['Counselor', 'HR Manager', 'Writer', 'Artist', 'Psychologist', 'Designer', 'Teacher']
    },
    'INTJ': {
      type: 'INTJ',
      description: 'Independent, original, analytical, determined, innovative, reserved, and insightful.',
      careers: ['Scientist', 'Engineer', 'Professor', 'Medical Doctor', 'Corporate Strategist', 'System Analyst', 'Architect']
    },
    'ISTP': {
      type: 'ISTP',
      description: 'Tolerant, flexible, observant, practical, realistic, factual, analytical, and logical.',
      careers: ['Engineer', 'Mechanic', 'Pilot', 'Economist', 'Computer Programmer', 'Forensic Scientist']
    },
    'ISFP': {
      type: 'ISFP',
      description: 'Quiet, friendly, sensitive, kind, aesthetic, concrete, present-oriented, and cooperative.',
      careers: ['Artist', 'Designer', 'Nurse', 'Musician', 'Teacher', 'Psychologist', 'Chef', 'Veterinarian']
    },
    'INFP': {
      type: 'INFP',
      description: 'Idealistic, loyal, curious, adaptable, creative, passionate, and perceptive.',
      careers: ['Writer', 'Counselor', 'Teacher', 'Artist', 'Psychologist', 'Human Resources', 'Graphic Designer']
    },
    'INTP': {
      type: 'INTP',
      description: 'Logical, original, creative, analytical, theoretical, reserved, and flexible.',
      careers: ['Computer Programmer', 'Mathematician', 'Professor', 'Scientist', 'Architect', 'Writer', 'Lawyer']
    },
    'ESTP': {
      type: 'ESTP',
      description: 'Adaptable, active, energetic, observant, pragmatic, spontaneous, and playful.',
      careers: ['Entrepreneur', 'Sales Representative', 'Marketing', 'Police Officer', 'Detective', 'Paramedic', 'Athlete']
    },
    'ESFP': {
      type: 'ESFP',
      description: 'Outgoing, friendly, accepting, practical, observant, spontaneous, and playful.',
      careers: ['Entertainer', 'Sales Representative', 'Event Planner', 'Child Care', 'Social Worker', 'Fashion Designer']
    },
    'ENFP': {
      type: 'ENFP',
      description: 'Enthusiastic, creative, spontaneous, optimistic, supportive, playful, and versatile.',
      careers: ['Journalist', 'Counselor', 'Consultant', 'Marketing', 'Artist', 'Actor', 'Teacher', 'Politician']
    },
    'ENTP': {
      type: 'ENTP',
      description: 'Innovative, strategic, entrepreneurial, adaptable, analytical, theoretical, and debative.',
      careers: ['Entrepreneur', 'Lawyer', 'Psychologist', 'Engineer', 'Scientist', 'Inventor', 'Creative Director']
    },
    'ESTJ': {
      type: 'ESTJ',
      description: 'Practical, realistic, decisive, systematic, organized, logical, and objective.',
      careers: ['Business Executive', 'Judge', 'Project Manager', 'School Administrator', 'Government Employee', 'Financial Officer']
    },
    'ESFJ': {
      type: 'ESFJ',
      description: 'Warm-hearted, conscientious, cooperative, loyal, sociable, practical, and organized.',
      careers: ['Teacher', 'Healthcare Worker', 'Social Worker', 'HR Manager', 'Sales Manager', 'Public Relations']
    },
    'ENFJ': {
      type: 'ENFJ',
      description: 'Warm, empathetic, responsive, responsible, charismatic, inspiring, and sociable.',
      careers: ['Teacher', 'Counselor', 'Psychologist', 'Human Resources', 'Writer', 'Marketing', 'Non-profit Director']
    },
    'ENTJ': {
      type: 'ENTJ',
      description: 'Frank, decisive, strategic, logical, analytical, organized, and confident.',
      careers: ['Executive', 'Lawyer', 'Entrepreneur', 'Management Consultant', 'University Professor', 'Software Developer']
    }
  };
  
  return temperaments[type] || {
    type: 'Unknown',
    description: 'We could not determine your temperament type.',
    careers: []
  };
};

// Example usage:
// This function demonstrates how to use the assessment system
export const takePersonalityTest = (questions: any[], userAnswers: number[]): TemperamentResult => {
  // Calculate the temperament type based on user answers
  const temperamentType = calculateTemperamentTypeFromRawAnswers(userAnswers, questions);
  
  // Get the description for the calculated type
  return getTemperamentDescription(temperamentType);
};

// Example:
// const questions = [/* Your questions data */];
// const userAnswers = [0, 2, 1, 3, 0, 2, 1, 0, 3, 1, 2, 0, 3, 1, 2, 0, 3, 1, 2, 0];
// const result = takePersonalityTest(questions, userAnswers);
// console.log(`Your personality type is: ${result.type}`);
// console.log(`Description: ${result.description}`);
// console.log(`Recommended careers: ${result.careers.join(', ')}`);