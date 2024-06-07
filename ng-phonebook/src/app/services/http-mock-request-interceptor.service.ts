import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import * as storage from '../data.json';

const urls = [
    {
        url: "http://localhost:8080/api/contact",
        method: 'GET',
        getData: (request, id) => {
            console.log(request, id);
            return storage.data
        }
    }
    , {
        url: "http://localhost:8080/api/contact",
        method: 'POST',
        getData: (request, id) => {
            request.body.id = storage.data.length + 1;
            storage.data.push(request.body)
            return request.body
        }
    }, {
        url: "http://localhost:8080/api/contact/#",
        method: 'GET',
        getData: (request, id) => {
            return storage.data.filter(item => item.id+"" === id)[0]
        }
    }, {
        url: "http://localhost:8080/api/contact/#",
        method: 'PUT',
        getData: (request, id) => {
            let foundItem = storage.data.filter(item => item.id+"" === id)[0];
            Object.assign(foundItem, request.body);

            return foundItem
        }
    },
    {
      url: "http://localhost:8080/api/contact/#",
      method: 'DELETE',
      deleteData: (request, id) => {
          //let foundItem = storage.data.filter(item => item.id+"" === id)[0];
          console.log('before  deletion', storage.data,id, storage.data.filter(item => item.id+""== id)[0].id);
           const idx = storage.data.indexOf(storage.data.filter(item => item.id+""== id)[0].id);
           storage.data.splice(idx, 1);
           console.log('after deletion', storage.data);
           return storage.data;

      }
  }
];

@Injectable()
// @ts-ignore
export class HttpMockRequestInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        for (const element of urls) {

          if (request.method == element.method) {
            if(request.method === 'DELETE') {
              let url = new URL(request.url);
              let id = url.pathname.replace("/api/contact/", "")
              if (id && url.origin + "/api/contact/#" === element.url ) {
                  return of(new HttpResponse({status: 200, body: element.deleteData(request, id)}));
              }
            }
            else if (request.url === element.url) {
                return of(new HttpResponse({status: 200, body: element.getData(request, null)}));
            } else {

                let url = new URL(request.url);
                let id = url.pathname.replace("/api/contact/", "")
                if (id && url.origin + "/api/contact/#" === element.url ) {
                    return of(new HttpResponse({status: 200, body: element.getData(request, id)}));
                }
            }
          }

          console.log("Unable to find the path", request.url, request.method)
        }

        return next.handle(request);
    }
}
