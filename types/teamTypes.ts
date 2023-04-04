// @ts-nocheck
import {IsOptional, IsUrl, Length, Matches, ValidateIf} from "class-validator";

export class BasicTeam {
    @Length(3, 32)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    name: string;
    @Length(0, 200)
    @IsOptional()
    description?: string;
    @ValidateIf(t => t.pfp !== '')
    @IsUrl()
    @IsOptional()
    pfp?: string;
    public: boolean;
}

export class Team extends BasicTeam {
    @Length(6, 32)
    @Matches(/^[A-Za-z0-9_]*$/)
    owner: string;
}

export interface MemberStat {
    username: string,
    num_competing: number,
    num_solves: number,
    total_points?: string
}
