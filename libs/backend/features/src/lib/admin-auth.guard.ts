/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly jwtStrategy: JwtStrategy) {
        super();
    }

    override async canActivate(context: ExecutionContext) : Promise<boolean> {
        const isAuthorized = await super.canActivate(context);

        if (!isAuthorized) {
            return false;
        }

        try {
            const user = await this.jwtStrategy.validate(context.switchToHttp().getRequest())

            const isAdmin = user.user.email === 'info@cswdi-web-app.com';
    
            return isAdmin;
        } catch (error: any) {
            Logger.error(`Error validating JWT: ${error.message}`, AdminAuthGuard.name);
            return false;
        }
    }
}