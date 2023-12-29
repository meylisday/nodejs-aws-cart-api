import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const [name] = atob(token.split(":")[1]).split(":");
            request['user'] = { name };
        } catch (e) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
