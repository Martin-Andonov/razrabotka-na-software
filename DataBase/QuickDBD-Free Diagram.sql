-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oVecJj
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE `Customer` (
    `CustomerID` int  NOT NULL ,
    `ScreenName` varchar(50)  NOT NULL ,
    `Balance` int  NOT NULL ,
    `Name` varchar(50)  NOT NULL ,
    `Email` varchar(50)  NOT NULL ,
    `Password` varchar(50)  NOT NULL ,
    PRIMARY KEY (
        `CustomerID`
    ),
    CONSTRAINT `uc_Customer_ScreenName` UNIQUE (
        `ScreenName`
    )
);

CREATE TABLE `Bets` (
    `BetID` int  NOT NULL ,
    `CustomerID` int  NOT NULL ,
    `Amount` money  NOT NULL ,
    -- if 0 not finished if 1 finished
    `BetStatus` boolean  NOT NULL ,
    `BetResult` int  NOT NULL ,
    `Odds` float  NOT NULL ,
    PRIMARY KEY (
        `BetID`
    )
);

CREATE TABLE `Status` (
    `OrderStatusID` int  NOT NULL ,
    `Won` boolean  NOT NULL ,
    `Loss` boolean  NOT NULL ,
    `Push` boolean  NOT NULL ,
    PRIMARY KEY (
        `OrderStatusID`
    )
);

ALTER TABLE `Bets` ADD CONSTRAINT `fk_Bets_CustomerID` FOREIGN KEY(`CustomerID`)
REFERENCES `Customer` (`CustomerID`);

ALTER TABLE `Bets` ADD CONSTRAINT `fk_Bets_BetResult` FOREIGN KEY(`BetResult`)
REFERENCES `Status` (`OrderStatusID`);

