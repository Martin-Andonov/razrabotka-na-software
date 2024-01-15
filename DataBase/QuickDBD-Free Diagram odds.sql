-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oVecJj
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE `OddsTable` (
    `BetId` int  NOT NULL ,
    `HomeTeam` varchar(50)  NOT NULL ,
    `AwayTeam` varchar(50)  NOT NULL ,
    -- should only be h2h for now
    `Market` varchar(10)  NOT NULL ,
    `HomeTeamOdds` float  NOT NULL ,
    `AwayTeamOdds` float  NOT NULL ,
    -- only on sports that support draw option
    `DrawOdds` float  NOT NULL ,
    PRIMARY KEY (
        `BetId`
    )
);

