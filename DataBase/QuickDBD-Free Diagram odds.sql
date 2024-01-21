create database if not exists razrabotka;
use razrabotka;


CREATE TABLE `OddsTable` (
    `BetId` int AUTO_INCREMENT  NOT NULL ,
    `HomeTeam` varchar(50)  NOT NULL ,
    `AwayTeam` varchar(50)  NOT NULL ,
    -- should only be h2h for now
    `Market` varchar(10)  NOT NULL ,
    `HomeTeamOdds` float  NOT NULL ,
    `AwayTeamOdds` float  NOT NULL ,
    -- only on sports that support draw option
    `DrawOdds` float  NULL ,
    PRIMARY KEY (
        `BetId`
    )
);