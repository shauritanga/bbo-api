const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");

dotenv.config();
//ROUTES
const customerRoute = require("./routes/customer.js");
const orderRoute = require("./routes/order.js");
const securityRoute = require("./routes/security.js");
const paymentMethodRoute = require("./routes/payment_method.js");
const employeeRoute = require("./routes/employee.js");
const roleRoute = require("./routes/role.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const authRoute = require("./routes/auth.js");
const emailRoute = require("./routes/email.js");
const financialYearRoute = require("./routes/financialYear.js");
const reportsRoute = require("./routes/reports.js");
const categoryRoute = require("./routes/category.js");
const fileRoute = require("./routes/uploadFile.js");
const accountRoutes = require("./routes/account.js");
const executionRoute = require("./routes/execution.js");

const { auditMiddleware, authenticated } = require("./middleware/index.js");

const app = express();

app.use(express.json());
app.use(logger("tiny"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.options("/api/v1/financial-years", cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", auditMiddleware, authRoute);
app.use("/api/v1/categories", authenticated, auditMiddleware, categoryRoute);
app.use("/api/v1/reports", authenticated, auditMiddleware, reportsRoute);
app.use("/api/v1/emails", authenticated, auditMiddleware, emailRoute);
app.use(
  "/api/v1/transactions",
  authenticated,
  auditMiddleware,
  transactionRoutes
);
app.use("/api/v1/customers", authenticated, auditMiddleware, customerRoute);
app.use("/api/v1/orders", authenticated, auditMiddleware, orderRoute);
app.use("/api/v1/securities", authenticated, auditMiddleware, securityRoute);
app.use(
  "/api/v1/financial-years",
  authenticated,
  auditMiddleware,
  financialYearRoute
);
app.use(
  "/api/v1/paymethods",
  authenticated,
  auditMiddleware,
  paymentMethodRoute
);
app.use("/api/v1/employees", authenticated, auditMiddleware, employeeRoute);
app.use("/api/v1/roles", authenticated, auditMiddleware, roleRoute);
app.use("/api/v1/executions", authenticated, auditMiddleware, executionRoute);
app.use("/api/v1/uploads", authenticated, auditMiddleware, fileRoute);
app.use("/api/v1/accounts", authenticated, auditMiddleware, accountRoutes);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL)
  .then((connect) =>
    app.listen(PORT, console.log(`server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));
