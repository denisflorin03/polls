import { Injectable } from '@angular/core';

export interface Question {
  id?: string;
  text: string;
  options: string[];
}

export interface CreatePollRequest {
  title: string;
  description: string;
  questions: Question[];
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  userId: number;
  username: string;
  questions: Question[];
  createdAt: string;
  totalResponses: number;
}

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private baseUrl = 'http://localhost:8081/api';

  async createPoll(pollData: CreatePollRequest): Promise<Poll> {
    const response = await fetch(`${this.baseUrl}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollData),
    });

    if (!response.ok) {
      throw new Error('Failed to create poll');
    }

    return response.json();
  }

  async getMyPolls(): Promise<Poll[]> {
    const response = await fetch(`${this.baseUrl}/polls/my-polls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch polls');
    }

    return response.json();
  }

  async getPoll(id: number): Promise<Poll> {
    const response = await fetch(`${this.baseUrl}/polls/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch poll');
    }

    return response.json();
  }

  async deletePoll(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/polls/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete poll');
    }
  }
}
