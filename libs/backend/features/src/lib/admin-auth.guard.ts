import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    override canActivate(context: ExecutionContext) : boolean | Promise<boolean> | Observable<boolean> {
        const isAuthorized = super.canActivate(context);

        if (!isAuthorized) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const isAdmin = user.email === 'info@cswdi-web-app.com';

        return isAdmin;
    }
}