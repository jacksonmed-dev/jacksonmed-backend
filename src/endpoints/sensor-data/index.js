import makeSensorDataEndpointHandler from "./sensor-data-endpoint-handler.js";
import sensorDataRepository from "./sensor-data-repository.js";

//Create one instance of the database separately from the Repository (database query handler) and Endpoint Handler.
//This will keep your database loosely coupled with your main-facebook-campaign-business logic and HTTPS validation logic

//Use the database to define database query functions in the Repository
//Return the Repository to use in the Endpoint Handler
//The Endpoint Handler will validate HTTPS requests before referencing the Repository to execute a database query.

export default function makeSensorDataService(database) {
    const repository = sensorDataRepository({ database })
    return makeSensorDataEndpointHandler({repository})
}
