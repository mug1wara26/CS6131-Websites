// @ts-nocheck
import {Length, IsEmail, IsUrl, IsOptional, IsAlphanumeric, IsStrongPassword} from "class-validator"

export class BasicUser {
    @Length(6, 32)
    @IsAlphanumeric()
    username: string;
    @Length(3,32)
    @IsAlphanumeric()
    displayName: string;
    @IsEmail()
    email: string;
    @IsUrl()
    @IsOptional()
    pfp?: string;
    @Length(0,200)
    @IsOptional()
    bio?: string;
}

export class RegisteringUser extends BasicUser {
    @Length(8,1024)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password: string;
}

export class User extends BasicUser{
    hash: string;
}