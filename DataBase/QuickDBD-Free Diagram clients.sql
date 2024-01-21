create database razrabotka;
use razrabotka;

CREATE TABLE `Customer` (
    `CustomerID` int AUTO_INCREMENT  NOT NULL ,
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
    `money` int  NOT NULL ,
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

INSERT INTO Customer ( ScreenName, Balance, Name, Email, Password)
VALUES
    ( 'user1', 1000, 'John Doe', 'john.doe@example.com', 'password123'),
    ( 'user2', 500, 'Jane Smith', 'jane.smith@example.com', 'securepassword'),
    ( 'user3', 1500, 'Bob Johnson', 'bob.johnson@example.com', 'pass123word');