import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  showModal = false;
  userName = '';

  newNote = {
    title: '',
    content: '',
  };

  // showModal: boolean = false;
  editableNote: any = {
    id: 0,
    title: '',
    content: '',
  };

  notes: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

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

  editNote(note: any) {
    this.editableNote = { ...note }; // clone the note to edit
    this.showModal = true;
  }

  deleteNote(id: number) {
    // Call your delete API or logic here
    console.log('Delete note ID:', id);
  }

  updateNote() {
    // Send PUT request to backend
    this.http
      .put(
        `http://localhost:5232/api/notes/${this.editableNote.id}`,
        this.editableNote
      )
      .subscribe({
        next: (updated) => {
          const index = this.notes.findIndex(
            (n) => n.id === this.editableNote.id
          );
          if (index !== -1) this.notes[index] = { ...this.editableNote };

          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update:', err);
        },
      });
  }
  
}
