# Kanban Board (FullStack)

## `**Instructions**`

- Use **React** to solve this question.
- Use **Node, Express, Mongo** for backend
- Use **Redux** for state management.
- Use **Chakra-UI** for styled components.

---

# `**Problem Statement**`

- The objective is to build a [kanban board](https://en.wikipedia.org/wiki/Kanban_board) app where user can create and manage their tasks with subtasks on different boards.
- The app should have a Navbar with the following routes
    - Sign up - (/signup)
    - Sign in - (/signin)
    - Kanban Board - (/board)

---

# `**Sign-up Route**`

- This user should be prompted by a signup form, where the user will enter the following credentials
    - Email
    - Password
- On form submit store this credential in your backend using the route “**/signup**”.
- Follow all the coding standards, hash the password using any encrypting library such as “**bcrypt**” before storing in database.
- After signing up successfully, the user should be redirected to the Sign in route.

---

# `**Sign-in Route**`

- This user should be prompted by a login form, where the user will enter the following credentials
    - Email
    - Password
- On form submit, match the entered credentials with the data stored in your backend (Verify both email and password) using the backend route “**/login**”
- On successful validation alert “**Login Successful**”, generate a token for the user using **jsonwebtoken** (store the token in localStorage**)**  and redirect the user to Dashboard page.
- On entering wrong credential, alert “**Invalid Credentials**” and re-prompt the user to enter valid credentials.

---

# `**Kanban Dashboard**`

- The dashboard page should be a private route, only users who have signed in can access this route.
- The first board should be created by default,
- The user should be able to create new boards by clicking on “Create New Board” button which when clicked will open up a modal asking for the Board Name. **(optional)**
- Each board will have three sub-categories :  Todo, Doing and Done, as shown in the reference image below.

![                                                                    Kanban Board Reference Image](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6de4690e-6952-4a4e-b9dd-33232ebb70c4/Kanban_Reference_Image.png)

                                                                    Kanban Board Reference Image

- The user should be able add task to  a board by clicking on the “Add New Task” button which will open up a modal with the following fields
    - Task Name
    - Description
    - Subtasks (Should support multiple)
    - Current Status (Select tag with Todo, Doing, Done as options)
    - Create Task Button

![                                         Creating Task with Subtasks](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/72c781fb-d695-4bb4-b8ae-5cef661b59db/Kanban_Reference_Image_-_2.png)

                                         Creating Task with Subtasks

- All the created tasks should be rendered in the form of cards with the number of subtasks displayed as shown in the Reference Image.
- Clicking on any of these taks should open up a modal, where the user can mark the subtasks as completed and also can update the Current Status of the task.

![                                                    Update Tasks](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/077bdf67-5116-473e-9165-d668ed2fa3b9/Kanban_Reference_Image_-_3.png)

                                                    Update Tasks

- The user should also be able to delete an existing task.

---

# `**Backend**`

The backend for Kanban Board should have the following models

- Board Model

```yaml
{
 _id: ObjectId,
  name: String,
  tasks: [{ type: ObjectId, ref: 'Task'}]
}
```

- Task Model

```yaml
{
 _id: ObjectId,
	title : String,
	description : String,
	status : {type: String, enum: ['Todo', 'Doing', 'Done'], default: 'Todo'},
	subtask : [{ type: ObjectId, ref: 'Subtask'}]
}

```

- Subtask Model

```yaml
{
 _id: ObjectId,
	title : String,
	isCompleted : boolean
}
```

- Build API’s to create, read, update and delete boards, tasks and subtasks.

# `**API Reference**`

![                                                                  Model Schema Diagram](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4f8347e8-dd53-4f33-bc87-6a833277f35b/API_Reference_Image.png)

                                                                  Model Schema Diagram

```yaml
{
  "boards": [
    {
      "name": "Todo",
      "tasks": [
        {
          "title": "Build UI for onboarding flow",
          "description": "",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Sign up page",
              "isCompleted": true
            },
            {
              "title": "Sign in page",
              "isCompleted": false
            },
            {
              "title": "Welcome page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Build UI for search",
          "description": "",
          "status": "Todo",
          "subtasks": [
            {
              "title": "Search page",
              "isCompleted": false
            }
          ]
        }
      ]
    },
    {
      "name": "Doing",
      "tasks": [
        {
          "title": "Design settings and search pages",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Settings - Account page",
              "isCompleted": true
            },
            {
              "title": "Settings - Billing page",
              "isCompleted": true
            },
            {
              "title": "Search page",
              "isCompleted": false
            }
          ]
        },
        {
          "title": "Add account management endpoints",
          "description": "",
          "status": "Doing",
          "subtasks": [
            {
              "title": "Upgrade plan",
              "isCompleted": true
            },
            {
              "title": "Cancel plan",
              "isCompleted": true
            },
            {
              "title": "Update payment method",
              "isCompleted": false
            }
          ]
        }
      ]
    },
    {
      "name": "Done",
      "tasks": [
        {
          "title": "Conduct 5 wireframe tests",
          "description": "Ensure the layout continues to make sense and we have strong buy-in from potential users.",
          "status": "Done",
          "subtasks": [
            {
              "title": "Complete 5 wireframe prototype tests",
              "isCompleted": true
            }
          ]
        }
      ]
    }
  ]
}