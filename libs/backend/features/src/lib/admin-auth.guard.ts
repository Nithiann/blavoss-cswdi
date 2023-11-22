import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly jwtStrategy: JwtStrategy) {
        super();
    }

    override async canActivate(context: ExecutionContext) : Promise<boolean> {
        const isAuthorized = super.canActivate(context);

        if (!isAuthorized) {
            return false;
        }

        const user = await this.jwtStrategy.validate(context.switchToHttp().getRequest())

        const isAdmin = user.email === 'info@cswdi-web-app.com';

        return super.canActivate(context) && isAdmin;
    }
}