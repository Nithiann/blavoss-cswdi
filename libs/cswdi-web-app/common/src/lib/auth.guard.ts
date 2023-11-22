/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean | UrlTree>
| Promise<boolean | UrlTree>
| boolean
| UrlTree => {
    const currentUser = inject(AuthService).getDecodedToken();

    console.log(currentUser);
    const isAnon = !currentUser;
    if (isAnon) return inject(Router).createUrlTree(["/login", "user"]);

    return true;
}