// @ts-nocheck
import {Length, IsEmail, IsUrl, IsOptional} from "class-validator"

export class BasicUser {
    @Length(6, 32)
    username: string;
    @Length(3,32)
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
    password: string;
}

export class User extends BasicUser{
    hash: string;
}