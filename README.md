## Battleship - Evaluation Task

### backend branch

This is the backend branch of this repository. It contains all the code for the backend server including the REST API and socket.io code.
The complete backend was developed using `Node.js`, `Express.js`, `Socket.io`, and `Typescript`

#### Installation Instructions:

1. First, clone the repository: `https://github.com/bmutahhar/battleship-evaluation-task.git`
2. Switch to this branch using `git checkout backend`
3. Install all dependencies by running `npm install`
4. Run the project by using `npm start`
5. Open `http://localhost:8080` in your browser.

#### Running the project:

The `http://localhost:8080` opens to the default `/` endpoint where a server running successfully message can be seen. All the routes are present in the `routes` folder of this branch and all the controllers are present in the `controllers` branch. The `mongoose` models can be found inside `models` folder.
All of the validation and authentication checks have been performed for each route. Other details can be found in the design document in the `main` branch of this repository.
