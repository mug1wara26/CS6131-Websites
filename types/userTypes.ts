// @ts-nocheck
import {Length, IsEmail, IsUrl, IsOptional, IsStrongPassword, Matches} from "class-validator"

export class BasicUser {
    @Length(6, 32)
    @Matches(/^[A-Za-z0-9_]*$/)
    username: string;
    @Length(3,32)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    displayName: string;
    @IsEmail()
    email: string;
    @IsOptional()
    @IsUrl({require_valid_protocol: true, require_tld: true, require_protocol: true})
    pfp: string;
    @IsOptional()
    @Length(0,200)
    bio: string;
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