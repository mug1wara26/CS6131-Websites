import {IsAscii, IsNumber, IsOptional, Length, Matches, Max} from "class-validator";

export class BasicChallenge {
    @Length(1,64)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    name: string;
    @Length(36)
    ctfid: string;
    @Length(1,20)
    difficulty: string;
    @Length(1,32)
    category: string;
    @IsOptional()
    @IsNumber()
    @Max(10000)
    points: number;
}

export class Challenge extends BasicChallenge {
    @IsOptional()
    @IsAscii()
    @Length(0,256)
    flag: string;
}