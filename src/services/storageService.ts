import { Quiz } from '../types';

const STORAGE_KEY = 'eduvoice_quizzes';

class StorageService {
  public saveQuiz(quiz: Quiz): void {
    const quizzes = this.getQuizzes();
    quizzes.unshift(quiz); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }

  public getQuizzes(): Quiz[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao ler storage:", error);
      return [];
    }
  }

  public deleteQuiz(id: string): void {
    const quizzes = this.getQuizzes().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }
}

export const storageService = new StorageService();