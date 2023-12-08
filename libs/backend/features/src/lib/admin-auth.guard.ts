/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { userRole } from "@blavoss-cswdi/shared/api";

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly jwtStrategy: JwtStrategy) {
        super();
    }

    override async canActivate(context: ExecutionContext) : Promise<boolean> {
        const isAuthorized = await super.canActivate(context);
        Logger.log(`AdminAuthGuard canActivate: ${isAuthorized}`, AdminAuthGuard.name);
        if (!isAuthorized) {
            return false;
        }

        try {
            const user = await this.jwtStrategy.validate(context.switchToHttp().getRequest())

            const isAdmin = user.user.role === userRole.Admin;
    
            return isAdmin;
        } catch (error: any) {
            Logger.error(`Error validating JWT: ${error.message}`, AdminAuthGuard.name);
            return false;
        }
    }
}