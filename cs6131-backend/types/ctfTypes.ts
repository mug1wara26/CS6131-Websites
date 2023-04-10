// @ts-nocheck
import {IsIn, IsNumber, IsOptional, IsUrl, Length, Matches, Max, Min} from "class-validator";
import exp from "constants";

export class BasicCTF {
    @Length(3, 36)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    name: string;
    @Length(3, 32)
    @Matches(/^[A-Za-z0-9_\s]*$/)
    teamCreator: string;
    @IsNumber()
    @Min(0)
    @Max(4102444800) // 2100-01-01 00:00:00
    date: number;
    @IsIn(['Jeopardy', 'Attack-Defense', 'Mixed'])
    format: string;
    @IsOptional()
    @IsUrl()
    url: string;
    @Length(0, 200)
    @IsOptional()
    description: string;
    @Length(0, 2048)
    location: string;
    public: boolean
}

export class CTF extends BasicCTF {
    @Length(36)
    id: string;
}

export interface TeamLeaderboard {
    index: number,
    teamName: string,
    total: string
}

export interface UserLeaderboard {
    index: number,
    username: string,
    teamName: string,
    total: string
}

export interface TeamUserLeaderboard {
    index: number,
    username: string,
    num_solves: number,
    total_points: string
}

export interface ctfCompetingTeam {
    ctf: CTF,
    competingTeam: string
}