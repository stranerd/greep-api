## Application Structure

Hello guys! we are using a Domain Driven Development (DDD) for this application. The architechture used is **_The clean
architechture_**.

### Folder structure

There are 4 major folders;

- ##### Application
    - base

  Contains the common/base logics, types declerations of the app

    - contracts

  Structures/Interface for publicly exposed methods and properties of Classes in the app

    - domain

  Structures/Interface of common application entities

    - use-cases

  Use cases for various entities, mainly mapping the various functions/classes that would perform every logic/action
  like creating a new user.

- ##### Controller
  Contains the code logic that is called in the app routes by different endpoints
- ##### Repository
    - entities These are the component of the app, and it contains the Interface of each entry (How they should look,
      what they should contain)
    - mapper This maps the entities to their corresponding models (Database instance). Eg UserEntity is mapped to the
      UserModel at this level
    - mongoose-model
- ##### Server
  Contains the code for express server and exposes the app API
   