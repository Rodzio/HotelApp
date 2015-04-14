/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2015-03-21 23:37:30                          */
/*==============================================================*/

DROP DATABASE IF EXISTS `IDC Hotel Suite Database`;

CREATE DATABASE `IDC Hotel Suite Database`
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;
  
USE `IDC Hotel Suite Database`;

drop table if exists Events;

drop table if exists Hotels;

drop table if exists Reservations;

drop table if exists RoomTemplates;

drop table if exists Rooms;

drop table if exists UserPermissionLevels;

drop table if exists Users;

/*==============================================================*/
/* Table: Events                                                */
/*==============================================================*/
create table Events
(
   EventId              int not null AUTO_INCREMENT,
   UserId               varchar(30),
   HotelId              smallint,
   RoomNumber           smallint,
   EventTitle           varchar(128) not null,
   EventDescription     varchar(512),
   EventTimestamp       timestamp not null,
   EventCompleted       bool not null,
   primary key (EventId)
);

alter table Events comment 'Needed for employees managament. 

For example t';

/*==============================================================*/
/* Table: Hotels                                                */
/*==============================================================*/
create table Hotels
(
   HotelId              smallint not null AUTO_INCREMENT,
   HotelName            varchar(128) not null,
   HotelCountry         varchar(50) not null,
   HotelCity            varchar(128) not null,
   HotelStreet          varchar(128) not null,
   HotelRating          smallint not null,
   HotelEmail           varchar(70),
   HotelPhone           varchar(20),
   primary key (HotelId)
);

/*==============================================================*/
/* Table: Reservations                                          */
/*==============================================================*/
create table Reservations
(
   ReservationId        varchar(36) not null,
   HotelId              smallint not null,
   RoomNumber           smallint not null,
   UserId               varchar(30),
   ReservationCheckIn   date,
   ReservationCheckOut  date,
   primary key (ReservationId)
);

/*==============================================================*/
/* Table: RoomTemplates                                         */
/*==============================================================*/
create table RoomTemplates
(
   TemplateId           varchar(50) not null,
   RoomTemplateName     varchar(128) not null,
   RoomTemplateCost     float not null,
   RoomTemplateDescription varchar(512),
   primary key (TemplateId)
);

/*==============================================================*/
/* Table: Rooms                                                 */
/*==============================================================*/
create table Rooms
(
   HotelId              smallint not null,
   RoomNumber           smallint not null,
   TemplateId           varchar(50) not null,
   primary key (HotelId, RoomNumber)
);

/*==============================================================*/
/* Table: UserPermissionLevels                                  */
/*==============================================================*/
create table UserPermissionLevels
(
   UserPermissionsLevelName varchar(64) not null,
   ManageHotels         bool,
   ManageRooms          bool,
   ManageGuests         bool,
   ManageEmployees      bool,
   ManageReservations   bool,
   primary key (UserPermissionsLevelName)
);

/*==============================================================*/
/* Table: Users                                                 */
/*==============================================================*/
create table Users
(
   UserId               varchar(30) not null,
   UserPermissionsLevelName varchar(64) not null,
   UserFirstName        varchar(50) not null,
   UserSecondName       varchar(50),
   UserLastName         varchar(70) not null,
   UserEmail            varchar(70) not null,
   UserPasswordHash     varchar(512) not null,
   primary key (UserId)
);

alter table Events add constraint `FK_Employee assigned to event` foreign key (UserId)
      references Users (UserId) on delete restrict on update restrict;

alter table Events add constraint `FK_Room's Events` foreign key (HotelId, RoomNumber)
      references Rooms (HotelId, RoomNumber) on delete restrict on update restrict;

alter table Reservations add constraint `FK_Room's reservations` foreign key (HotelId, RoomNumber)
      references Rooms (HotelId, RoomNumber) on delete restrict on update restrict;

alter table Reservations add constraint `FK_User's reservations` foreign key (UserId)
      references Users (UserId) on delete restrict on update restrict;

alter table Rooms add constraint `FK_Hotel's rooms` foreign key (HotelId)
      references Hotels (HotelId) on delete restrict on update restrict;

alter table Rooms add constraint `FK_Room's template` foreign key (TemplateId)
      references RoomTemplates (TemplateId) on delete restrict on update restrict;

alter table Users add constraint `FK_User's permission level` foreign key (UserPermissionsLevelName)
      references UserPermissionLevels (UserPermissionsLevelName) on delete restrict on update restrict;

