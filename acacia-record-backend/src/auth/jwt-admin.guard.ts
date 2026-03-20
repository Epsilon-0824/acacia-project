
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        if(err || !user){
            throw err || new UnauthorizedException(); // 401
        }
        if(user.user_permission !== 'ADMIN'){
            throw new ForbiddenException('เฉพาะ admin เท่านั้น'); // 403
        }
        return user;
    }
}
