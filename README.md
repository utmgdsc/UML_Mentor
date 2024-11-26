# UML_Mentor


### Development guide (OUTDATED)
Clone the repository 
```
git clone https://github.com/utmgdsc/UML_Mentor.git
cd UML_Mentor
```
Install the dependencies 
```
npm install
cd client 
npm install
```
Run the client in dev mode
```
npm run dev
```
Go to `server/index.js` and uncomment line `18` 
```js
await importChallenges();
```
Open a new terminal and run the server in dev mode (execute from root directory).
```
npm run devStart
```
The challenges are now imported from the `challenges.json` into the SQLite database. You should now uncomment line 18 to avoid import errors in the future runs. Alternatively, you can pass the `true` parameter to tell the function to reimport challenges on every run (not recommended). 
```js
// await importChallenges();
```
Access the app via the client port `3000`. All of the client requests starting with `/api` are redirected to the server `8080`. 

## Developer's Documentation

### Frontend

#### Router

#### Pages

#### Componenets

#### Hooks

#### Types

#### Styles

### Backend

#### Routes

#### Controllers

#### Models

#### Scripts

#### Middleware

#### AI
For Eren to do. 

### Authentication

#### Shibboleth

### Running the app

#### Development

#### Production


## Basic user documentation

### Solving challenges.

### Posting solutions. 

### Viewing solutions.

## Admin documentation

### Managing challenges
- Add
- Delete
- Hide
- Edit (todo)

### Managing users
- Delete Solutions
- Delete comments
- Admin dashboard

