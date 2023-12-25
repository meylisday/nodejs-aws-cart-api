import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../users";
import { User } from "../users";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(name: string, password: string) {
    const user = await this.usersService.findUser(name);
    if (user) {
      return user;
    }

    return this.usersService.createOne({ name, password })
  }

  async login(params: User, type) {
    const user = await this.usersService.findUser(params.name);

    if (!user) {
      throw new UnauthorizedException();
    }

    const LOGIN_MAP = {
      jwt: () => this.loginJWT(user),
      basic: () => this.loginBasic(user),
      default: () => this.loginJWT(user),
    }
    const login = LOGIN_MAP[type];

    return login ? login(user) : LOGIN_MAP.default();
  }

  loginJWT(user: User) {
    const payload = { name: user.name, id: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  loginBasic(user: User) {
    function encodeUserToken(user) {
      const { name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}