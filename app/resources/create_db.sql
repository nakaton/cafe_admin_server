### MySQL scripts for dropping existing tables and recreating the database table structure


### DROP Tables ###
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Order;
DROP TABLE IF EXISTS OrderDetail;


### TABLES ###
# Tables must be created in a particular order due to referential constraints i.e. foreign keys.
CREATE TABLE User
  (
     user_id                INT NOT NULL AUTO_INCREMENT,
     user_name              VARCHAR(64) NOT NULL,
     email                  VARCHAR(128) NOT NULL,
     given_name             VARCHAR(128) NOT NULL,
     family_name            VARCHAR(128) NOT NULL,
     password               VARCHAR(256) NOT NULL COMMENT 'Only store the hash here, not actual password!',
     auth_token             VARCHAR(32),
     profile_photo_filename VARCHAR(128),
     create_person          VARCHAR(32),
     create_date            DATETIME,
     update_person          VARCHAR(32),
     update_date            DATETIME,
     PRIMARY KEY (user_id),
     UNIQUE (user_name),
     UNIQUE (email),
     UNIQUE (auth_token)
  )
ENGINE = InnoDB;

CREATE TABLE Category
  (
     category_cd            VARCHAR(4) NOT NULL,
     category_name          VARCHAR(64) NOT NULL,
     parent_category_cd     VARCHAR(4),
     create_person          VARCHAR(32),
     create_date            DATETIME,
     update_person          VARCHAR(32),
     update_date            DATETIME,
     PRIMARY KEY (category_cd)
  )
ENGINE = InnoDB;

CREATE TABLE Product
  (
     product_cd             VARCHAR(4) NOT NULL,
     product_name           VARCHAR(64) NOT NULL,
     category_cd            VARCHAR(4) NOT NULL,
     unit_cost              DOUBLE NOT NULL,
     selling_price          DOUBLE NOT NULL,
     photo_filename         VARCHAR(128),
     comments               VARCHAR(2048),
     create_person          VARCHAR(32),
     create_date            DATETIME,
     update_person          VARCHAR(32),
     update_date            DATETIME,
     PRIMARY KEY (product_cd)
  )
ENGINE = InnoDB;

CREATE TABLE Order
  (
     order_no               VARCHAR(9) NOT NULL,
     customer_id            INT NOT NULL,
     order_time             DATETIME NOT NULL,
     amount                 DOUBLE NOT NULL,
     order_status           VARCHAR(1) NOT NULL,
     order_status_name      VARCHAR(32) NOT NULL,
     comments               VARCHAR(2048),
     create_person          VARCHAR(32),
     create_date            DATETIME,
     update_person          VARCHAR(32),
     update_date            DATETIME,
     PRIMARY KEY (order_no)
  )
ENGINE = InnoDB;

CREATE TABLE OrderDetail
  (
     order_no               VARCHAR(9) NOT NULL,
     product_cd             VARCHAR(4) NOT NULL,
     qty                    INT NOT NULL,
     product_status         VARCHAR(1) NOT NULL,
     product_status_name    VARCHAR(32) NOT NULL,
     comments               VARCHAR(2048),
     create_person          VARCHAR(32),
     create_date            DATETIME,
     update_person          VARCHAR(32),
     update_date            DATETIME,
     UNIQUE (order_no, product_cd)
  )
ENGINE = InnoDB;