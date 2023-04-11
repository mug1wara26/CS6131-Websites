import {IsBoolean, IsOptional, Length, Matches} from "class-validator";

export class BasicWriteup {
    @IsBoolean()
    public: boolean;
    @Length(1, 128)
    @Matches(/^[A-Za-z0-9\s]*$/)
    title: string;
    @Length(1, 65535)
    content: string;
    @IsOptional()
    @Length(1,64)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    chalName: string;
    @IsOptional()
    @Length(36)
    ctfid: string;
}

export class Writeup extends BasicWriteup {
    @Length(36)
    id: string;
    votes: number;
}