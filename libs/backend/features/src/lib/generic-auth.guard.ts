import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from "./jwt.strategy";

@Injectable()
export class GenericAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly jwtStrategy: JwtStrategy) {
        super();
    }

    override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    
}