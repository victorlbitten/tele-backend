import express from 'express';
import { usersRouter } from './routers/users';
import { pacientsRouter } from './routers/pacients';
import { appointmentsRouter } from './routers/appointments';
import { prescriptionsRouter } from './routers/prescriptions';
import { clinicalConditionsRouter } from './routers/clinicalConditions';
const cors = require('cors');


// Just making sure in case I decide to deploy it to Heroku later on
const port: string | undefined = process.env.PORT || '3000';


// MIDDLEWARES
const app = express();
app.use(express.json());
app.use(cors());


// ROUTES
app.use("/users", usersRouter);
app.use("/pacients", pacientsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/prescriptions", prescriptionsRouter);
app.use("/clinical-conditions", clinicalConditionsRouter);



// START SERVER
app.listen(port, () => `Server running on port ${port}`);

