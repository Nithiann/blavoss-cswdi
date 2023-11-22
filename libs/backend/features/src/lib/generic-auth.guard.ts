import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GenericAuthGuard extends AuthGuard('jwt') implements CanActivate {
    override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    
}