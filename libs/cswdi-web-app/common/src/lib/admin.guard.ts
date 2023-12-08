/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { userRole } from "@blavoss-cswdi/shared/api";

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean | UrlTree>
| Promise<boolean | UrlTree>
| boolean
| UrlTree => {
    const currentUser = inject(AuthService).getDecodedToken();

    const isAnon = !currentUser;
    if (isAnon) return inject(Router).navigate(["/user/login"]);

    return currentUser.role === userRole.Admin ? true : inject(Router).createUrlTree(["/"]);
}