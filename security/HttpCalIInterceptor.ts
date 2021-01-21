import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable()
export class HttpCalIInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private spinner: NgxSpinnerService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercepted request: ' + this.router.url);

        let clonedRequest = request.clone();

        if (this.router.url != '/login') {

            clonedRequest = request.clone({ headers: request.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token')) });

        }


        // Pass the cloned request instead of the original request to the next handle

        this.spinner.show();

        return next.handle(clonedRequest).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && event.status === 200) {
                this.spinner.hide();
            }
        },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 || err.status === 500) {
                        this.spinner.hide();
                        this.router.navigate(['login']);
                    }

                    return;

                }
            }));


    }
}
