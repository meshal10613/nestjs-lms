import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './course/course.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const uri = config.get<string>('MONGODB_URI');

                if (!uri) {
                    throw new Error('MONGODB_URI is not defined');
                }

                return { uri };
            },
        }),
        AuthModule,
        UserModule,
        CourseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
