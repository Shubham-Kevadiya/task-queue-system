# task-queue-system

## Setup Instruction:

1. To run this project redis, node, postman etc. shoulb be set up in your device.

## How to run project:

1. First you have to check that package.json and package-lock.json files are there in this project in your device.
2. if project has package.json file then open terminal and run **npm i** command. This command will install all required dependencies for this project.
3. You have to create **.env** file with following credentials,

- PORT
- REDIS_HOST
- REDIS_PORT

4. Then you **npm start** simply run this command in terminal and your server will start, wait for log **App listening on port{your port}** in terminal. If this you didn't get this log or get any other error solve it.

## API Examples:
- This project contains two apis
  1. Create Task
  2. Get status of Task using jobId

### 1. create task

- In this api job is created for you task and it will complete by worker.

_Path : /api/tasks/_

Method : POST

Params : No Params
Query Params : No Query Params

body type : JSON
body : {
text: {type : string},
operation:{type:reverse} this should be either uppercase or reverse
}

response type : JSON
response : {
"jobId": {type:string}
}

### 2. Status Check

- In this api status of perticuler job is checked using jobId, and if job's status is completed then send status and result both otherwise send only status.

_Path : /api/tasks/:taskId_

Method : GET

Params : taskId (type: string)
Query : No Query Params

body type : N/A
body : No body

response type : JSON

```
if status is **"completed"**

response : {
"job": {
"status": {type : string},
"result": {
"uppercase": {type:string},
"reverse": {type:string}
}
}
}
else
response : {
"status": {type : string}
}
```
