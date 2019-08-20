import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ICustomer } from './../../interfaces';

interface IApiResponse {
  message: string;
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  message: string;
  people: any[];

  url = environment.apiUrl + 'people';

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.message = "Loading...";

    this.getCustomers()
        .subscribe(data => {
          this.people = data;
          this.message = JSON.stringify(data);
        });
  }

  getCustomers() : Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(this.url)
               .map(data => {
                  return data['results'];
               });
  }

}
