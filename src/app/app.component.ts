import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

import { Subject, combineLatest } from 'rxjs'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'sample';
  searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  clubs;
  sub : Subscription;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();


  constructor(private afs: AngularFirestore){}

  ngOnInit(){
     combineLatest(this.startobs, this.endobs).subscribe((value)=>{
      this.firequery(value[0], value[1]).subscribe((clubs)=>{
        this.clubs = clubs;
      })
    })
  }

  search($event)
  {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");
  }


  firequery(start, end) {
    return  this.afs.collection('clubs', ref => ref.limit(4).orderBy('club').startAt(start).endAt(end)).valueChanges();
  }

}
