const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const customerRoute = require("./routes/customer.js");
const orderRoute = require("./routes/order.js");
const securityRoute = require("./routes/security.js");
const expenseRoute = require("./routes/expense.js");
const paymentMethodRoute = require("./routes/payment_method.js");
const employeeRoute = require("./routes/employee.js");
const roleRoute = require("./routes/role.js");
const receiptRoute = require("./routes/receipt.js");
const paymentRoute = require("./routes/payment.js");
const statementRoute = require("./routes/statement.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const authRoute = require("./routes/auth.js");
const emailRoute = require("./routes/email.js");
const financialYearRoute = require("./routes/financialYear.js");
const reportsRoute = require("./routes/reports.js");
const categoryRoute = require("./routes/category.js");
const logger = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const passport = require("passport");
const errorHandler = require("./middleware/error.js");
const dseRoute = require("./routes/dse.js");
const cdsRoute = require("./routes/cds.js");
const csmaRoute = require("./routes/csma.js");
const vatRoute = require("./routes/vat.js");
const brokerageRoute = require("./routes/brokerage.js");
const fidelityRoute = require("./routes/fidelity.js");
const executionRoute = require("./routes/execution.js");
const path = require("path");
const fileRoute = require("./routes/uploadFile.js");
const profileRoutes = require("./routes/profile.js");
const accountRoutes = require("./routes/account.js");
const { auditMiddleware } = require("./middleware/index.js");

dotenv.config();

const { protect } = "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(logger("tiny"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.options("/api/v1/financial-years", cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(auditMiddleware);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/reports", reportsRoute);
app.use("/api/v1/emails", emailRoute);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/customers", customerRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/securities", securityRoute);
app.use("/api/v1/expenses", expenseRoute);
app.use("/api/v1/statements", statementRoute);
app.use("/api/v1/financial-years", financialYearRoute);
app.use("/api/v1/paymethods", paymentMethodRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/receipts", receiptRoute);
app.use("/api/v1/roles", roleRoute);
app.use("/api/v1/executions", executionRoute);
app.use("/api/v1/uploads", fileRoute);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/accounts", accountRoutes);

//Fees

app.use("/api/v1/dse", dseRoute);
app.use("/api/v1/cds", cdsRoute);
app.use("/api/v1/csma", csmaRoute);
app.use("/api/v1/vat", vatRoute);
app.use("/api/v1/brokerage", brokerageRoute);
app.use("/api/v1/fidelity", fidelityRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL)
  .then((connect) =>
    app.listen(PORT, console.log(`server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));
