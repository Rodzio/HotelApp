DELETE FROM `idc hotel suite database`.`events` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`reservations` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`rooms` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`roomtemplates` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`hotels` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`users` WHERE 1=1;
DELETE FROM `idc hotel suite database`.`userpermissionlevels` WHERE 1=1;

ALTER TABLE `idc hotel suite database`.`hotels` AUTO_INCREMENT = 1;
ALTER TABLE `idc hotel suite database`.`reservations` AUTO_INCREMENT = 1;

INSERT INTO `idc hotel suite database`.`hotels`
(`HotelName`,
`HotelCountry`,
`HotelCity`,
`HotelStreet`,
`HotelRating`,
`HotelEmail`,
`HotelPhone`)
VALUES
("Słowianka",
"Polska",
"Koszalin",
"Majowa 5",
2,
"slowianka@hotele.pl",
"555-444-333");

INSERT INTO `idc hotel suite database`.`roomtemplates`
(`TemplateId`,
`RoomTemplateName`,
`RoomTemplateCost`,
`RoomTemplateDescription`)
VALUES
("aprez",
"Apartament Prezydencki",
512.64,
"Ekskluzywny apartament dla wymagających.");

INSERT INTO `idc hotel suite database`.`rooms`
(`HotelId`,
`RoomNumber`,
`TemplateId`)
VALUES
(1,001,"aprez"),
(1,002,"aprez");

INSERT INTO `idc hotel suite database`.`userpermissionlevels`
(`UserPermissionsLevelName`,
`ManageHotels`,
`ManageRooms`,
`ManageGuests`,
`ManageEmployees`,
`ManageReservations`)
VALUES
("guest",false,false,false,false,false),
("superadmin",true,true,true,true,true);

INSERT INTO `idc hotel suite database`.`users`
(`UserId`,
`UserPermissionsLevelName`,
`UserFirstName`,
`UserSecondName`,
`UserLastName`,
`UserEmail`,
`UserPasswordHash`)
VALUES
("B906512",
"superadmin",
"Michał",
"Krzysztof",
"Łuniewski",
"michal.krzysztof.luniewski@gmail.com",
"qwerty123");

INSERT INTO `idc hotel suite database`.`reservations`
(`HotelId`,
`RoomNumber`,
`UserId`,
`ReservationCheckIn`,
`ReservationCheckOut`)
VALUES
(1,001,"B906512","2015-04-01","2015-04-21"),
(1,001,"B906512","2015-04-06","2015-04-11"),
(1,001,"B906512","2015-04-12","2015-04-14"),
(1,001,"B906512","2015-04-15","2015-04-20"),
(1,002,"B906512","2015-04-01","2015-04-09"),
(1,002,"B906512","2015-04-21","2015-04-25");


INSERT INTO `idc hotel suite database`.`events`
(`UserId`,
`HotelId`,
`RoomNumber`,
`EventTitle`,
`EventDescription`,
`EventCompleted`)
VALUES
("B906512",
1,
001,
"Posprzątać pokój",
"Gość wprowadza się o 10",
false);
