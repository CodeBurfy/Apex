import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ContactService} from "../../services/contacts.service";
import {Contact} from "./contact";
import {updatePlaceholderMap} from "@angular/compiler/src/render3/view/i18n/util";
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  public contacts = [];
  tobeUpdatedContact = <Contact> {};
  eventsSubject: Subject<Contact> = new Subject<Contact>();

  @Output() update = new EventEmitter<Contact>();


  constructor(private contactService: ContactService,) {
  }

  ngOnInit(): void {
    this.readAll();
  }

  private readAll() {
    return this.contactService.loadAll().subscribe((list) => {
      this.contacts = list;
    });
  }

  onUpdate(c: Contact){
    this.contactService.putContact(c).subscribe(contact=>{
      console.log('i am gettign the contact in update:, ', c);
      this.tobeUpdatedContact = c;
      this.eventsSubject.next(c);
    })
  }

  showRecent(e:any) {
    console.log('in e from child: ', e);
  }
  onDelete(c: Contact) {

      console.log('in delete',c)
      this.contactService.deleteContact(c)
      .subscribe(contact => {


      })

  }



}
