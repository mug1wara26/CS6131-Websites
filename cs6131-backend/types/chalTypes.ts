import {IsAscii, IsNumber, IsOptional, Length, Matches, Max} from "class-validator";

export class BasicChallenge {
    @Length(1,64)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    name: string;
    @Length(36)
    ctfid: string;
    @Length(1,20)
    @IsOptional()
    difficulty: string;
    @Length(1,32)
    @IsOptional()
    category: string;
    @IsNumber()
    @Max(10000)
    @IsOptional()
    points: number;
}

export class Challenge extends BasicChallenge {
    @IsAscii()
    @Length(0,256)
    @IsOptional()
    flag: string;
}