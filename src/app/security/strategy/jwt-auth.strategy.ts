import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { type JWTPayload } from '../dto/JWTPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JWTPayload): Promise<bigint> {
    try {
      const userId = await this.authService.validateUser(id);

      if (!userId) throw new BadRequestException('Not authorized');

      return userId;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
