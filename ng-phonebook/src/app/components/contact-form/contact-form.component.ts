import {Component, OnInit, Input, SimpleChange, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {ContactService} from "../../services/contacts.service";
import {NgForm} from "@angular/forms";
import {Contact} from "../contact-list/contact";
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
    model = <Contact> {};
    submitted = false;
    btnName = 'Submit';
    @Input() tobeUpdatedContact:Contact;
    @Input() events:Observable<Contact>;
    @Output() forParent : EventEmitter<any> = new EventEmitter();

    private eventsSubscription: Subscription;


    constructor(private contactService: ContactService) {
    }

    ngOnInit(): void {

      this.eventsSubscription = this.events.subscribe((c) => {
        console.log('c in form:', c);
        this.model= c;
      });


    }


    ngOnchanges(changes:SimpleChanges){
      console.log('in changes',changes);
      this.forParent.emit(this.model);
    }




    createNew() {
        return  {} as Contact;
    }

    onSubmit(contactForm: NgForm) {
        this.submitted = true;

        this.contactService.getById(this.model.id)
        .subscribe(contact => {
          if(contact) {
            this.contactService.putContact(this.model)
            .subscribe(contact=> {
              console.log('succeffully updated');
            })
          }
        })

        if(!this.model.id) {
        this.contactService.postContact(this.model)
            .subscribe(contact => {
              //  console.log('object saved', contact);
                this.model = this.createNew();
                this.submitted = false;
                contactForm.resetForm();
            });
            console.log('submitted');
          }

    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}
