import { Component, OnInit,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit,AfterViewInit  {
  showModal = false;
  userName = '';

  newNote = {
    title: '',
    content: '',
  };

  notes: any[] = [];

  constructor(private http: HttpClient) {}
  
  @ViewChild('titleInput') titleInput!: ElementRef;

  ngAfterViewInit() {
    this.titleInput.nativeElement.focus();
  }

  ngOnInit(): void {
    this.fetchNotes();
    this.userName = localStorage.getItem('userName') || '';

  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newNote = { title: '', content: '' };
  }

  createNote() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post('http://localhost:5232/api/notes', this.newNote, { headers })
      .subscribe(
        (res: any) => {
          this.notes.unshift(res); // Add new note on top
          this.closeModal();
        },
        (err) => {
          console.error('Error creating note', err);
        }
      );
  }

  fetchNotes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any[]>('http://localhost:5232/api/notes', { headers })
      .subscribe(
        (data) => {
          this.notes = data;
        },
        (err) => {
          console.error('Error fetching notes', err);
        }
      );
  }
}
