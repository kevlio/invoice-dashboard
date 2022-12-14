# Invoice Dashboard
- Course: Web/mobile Development 
- Assignement 2: Invoice Dashboard
- Built on previous assignement and the time logged in: [time-tracker](https://github.com/kevlio/goal-tracker)

###  

## Getting started

```bash
git clone git@github.com/kevlio/invoice-dashboard
cd invoice-dashboard
npm install
npm start
```

## Available Scripts

### Run application

```bash
npm start
```

Runs client on [http://localhost:5173](http://localhost:5173) and development server on [http://localhost:3000](http://localhost:3000)

### Run client

```bash
npm run dev
```

Runs app in the development mode on [http://localhost:5173](http://localhost:5173)

### Run development server

```bash
npm run server
```

Runs development server ([json-server](https://github.com/typicode/json-server)) on [http://localhost:3000](http://localhost:3000)


### Dependencies (extract)

- [mantine](https://mantine.dev) - ui library
- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) - draggable and resizable grid layout
- [recharts](https://recharts.org/) - charting library
- [dayjs](https://github.com/iamkun/dayjs/) - date parsing and formatting
### DevDependencies

- [vite](https://github.com/vitejs/vite)
- [json-server](https://github.com/typicode/json-server)

### Types

Data is stored in the following format:

#### Users

```ts
id: string;             // uuidv4()
username: string;       // Project name
```

#### Invoices

```ts
id: string;             // autogenerated by json-server
customer: string;       // Customer name
projectName: string;    // Project name
projectId: string;      // Project id
hourlyRate: number;     // Rate by hour
duration: string        // Duration format hh:mm
fee: number;            // Hourly rate x duration
sentAt: string;         // Invoiced sent format YYYY-MM-DD
dueDate: string;        // Invoice due date format YYYY-MM-DD
status: "paid"          // Invoice payment status
        | "unpaid" 
        | "delayed";      
```
#### Projects

```ts
id: string;             // uuidv4()
name: string;           // Project name
user_id: string;        // Current userID/anonymous
description: string;    // Project description
color: string;          // CSS hex color
isDone: boolean         // Project completion(initial value false)
deadline: string;       // Project deadline (not fully implemented)

```

#### Tasks

```ts
id: string;             // uuidv4()
name: string;           // Task name
projectId: string;      // id of parent Project
user_id: string;        // Current userID/anonymous
color: string;          // CSS hex color
isDone: boolean         // Task completion
deadline: string;       // Project deadline (not fully implemented)
```

#### Timelogs

```ts
id: string;             // uuidv4()
taskId: string;         // id of parent Task
project_id: string;     // id of parent Project
user_id: string;        // Current userID/anonymous
startDate: string;      // start time, ISO 8601
stopDate: string;       // stop time, ISO 8601 
```

