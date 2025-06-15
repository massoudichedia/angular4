import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = '/api/interviews';

  constructor(private http: HttpClient) { }

  scheduleInterview(candidateId: number, calLink: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedule`, {
      candidate_id: candidateId,
      cal_link: calLink
    });
  }

  getInterviewDetails(interviewId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${interviewId}`);
  }
}