# Project README

  

## Frontend

  

To start the frontend, run the following command:

*npm run  start*

 

## Backend

 
To start  the  backend,  run  the  following  command:

*docker-compose up --build*

  

### Creating a Node

  

To create a Node with the label name "Person" and properties "Name: Taron" and "Age: 23", you should send a POST request to http://localhost:8080/node with the following JSON body:

  

{

	"name": "Person",

	"properties": {

		"name": "Taron",

		"age": "23"

	}

}

  
  

### Updating Node Properties

To update the properties of a Node, you should send a PUT request to http://localhost:8080/node/:id, where :id is the specific ID of the node. Include the updated properties in the JSON body of the request, for example:

  

{

	"properties": {

		"age": "23",

		"gender": "male"

	}

}

  

### Deleting a Node

To delete a Node, you should send a DELETE request to http://localhost:8080/node/:id, where :id is the specific ID of the node.

  

### Getting a Node

To get a Node, you should send a GET request to http://localhost:8080/node/:id, where :id is the specific ID of the node.

  

### Getting All Nodes from Postgre DB

To get all Nodes from the Postgre database, you should send a GET request to http://localhost:8080/node.

  

### Getting All Nodes from Neo4j DB

To get all Nodes from the Neo4j database, you should send a GET request to http://localhost:8080/node/neo4j.