import { User } from "@prisma/client";
import { prisma } from "./lib/db";

async function main() {
  // Example: CREATE USERS
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   INSERT INTO "User" (username, email, age, country, balance)
   VALUES ('john_doe', 'john@example.com', 25, 'USA', 0);
*/

  await prisma.user.create({
    data: {
      username: "john_doe",
      email: "john@example.com",
      age: 25,
      country: "USA",
      balance: 0,
    },
  });

  // --

  // Example: LIST USERS
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   SELECT * FROM "User";
*/

  const users = await prisma.user.findMany({});
  console.log(users);

  // --

  // Example: UPDATE USER
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   UPDATE "User" SET age = 26 WHERE username = 'john_doe';
*/

  const updatedUser = await prisma.user.update({
    where: {
      username: "john_doe",
    },
    data: {
      age: 26,
    },
  });

  console.log(updatedUser);

  // --

  // Example: DELETE USER
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   DELETE FROM "User" WHERE username = 'john_doe';
*/

  console.log(
    await prisma.user.delete({
      where: {
        username: "john_doe",
      },
    })
  );

  // --

  // Example: INSERT MULTIPLE USERS
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   INSERT INTO "User" (age, email, username, balance, country)
   VALUES (20, 'ahmed@cairotech.net', 'ahmed', 10000, 'EG'),
          (21, 'omar@cairotech.net', 'omar', 10000, 'EG'),
          (22, 'mahmoud@cairotech.net', 'mahmoud', 10000, 'EG');
*/

  const createMultipleUsers = async () => {
    const usersData = [
      {
        age: 20,
        email: "ahmed@cairotech.net",
        username: "ahmed",
        balance: 10000,
        country: "EG",
      },
      {
        age: 21,
        email: "omar@cairotech.net",
        username: "omar",
        balance: 10000,
        country: "EG",
      },
      {
        age: 22,
        email: "mahmoud@cairotech.net",
        username: "mahmoud",
        balance: 10000,
        country: "EG",
      },
    ];

    const createdUsers = await prisma.user.createMany({
      data: usersData,
    });

    console.log("Created users:", createdUsers);
  };

  createMultipleUsers().catch((error) => {
    console.error(error);
  });

  // --

  // Dependent Insertions - Example: MAKE TRANSACTIONS
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   -- Make transactions between users
   INSERT INTO "UserTransaction" (amount, description, createdAt, senderId, recipientId)
   VALUES (500, 'Payment for services', NOW(), 1, 2), -- Transaction from User 1 to User 2
          (1000, 'Monthly allowance', NOW(), 2, 3), -- Transaction from User 2 to User 3
          (200, 'Refund', NOW(), 3, 1); -- Transaction from User 3 to User 1
*/

  const makeTransactions = async () => {
    // Fetch user IDs from the database
    const user1 = (await prisma.user.findUnique({
      where: { username: "ahmed" },
    })) as User;
    const user2 = (await prisma.user.findUnique({
      where: { username: "omar" },
    })) as User;
    const user3 = (await prisma.user.findUnique({
      where: { username: "mahmoud" },
    })) as User;

    // Make transactions between users
    const transactionsData = [
      {
        amount: 500,
        description: "Payment for services",
        createdAt: new Date(),
        senderId: user1.id,
        recipientId: user2.id,
      },
      {
        amount: 1000,
        description: "Monthly allowance",
        createdAt: new Date(),
        senderId: user2.id,
        recipientId: user3.id,
      },
      {
        amount: 200,
        description: "Refund",
        createdAt: new Date(),
        senderId: user3.id,
        recipientId: user1.id,
      },
    ];

    for (const transaction of transactionsData) {
      // Update sender's balance (subtract the amount)
      await prisma.user.update({
        where: { id: transaction.senderId },
        data: { balance: { decrement: transaction.amount } },
      });

      // Update recipient's balance (add the amount)
      await prisma.user.update({
        where: { id: transaction.recipientId },
        data: { balance: { increment: transaction.amount } },
      });

      // Create the transaction record
      await prisma.userTransaction.create({
        data: transaction,
      });
    }

    console.log("Transactions completed.");
  };

  makeTransactions().catch((error) => {
    console.error(error);
  });

  // --

  // Example: LIST USERS AND THEIR RECEIVED TRANSACTIONS
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   SELECT
     "User".id,
     "User".username,
     "User".email,
     "User".balance,
     "User".country,
     "User".createdAt,
     "UserTransaction".id AS transactionId,
     "UserTransaction".amount,
     "UserTransaction".description,
     "UserTransaction".createdAt AS transactionCreatedAt,
     "UserTransaction".senderId,
     "UserTransaction".recipientId
   FROM "User"
   JOIN "UserTransaction" ON "User".id = "UserTransaction".recipientId;
*/

  const listUsersAndReceivedTransactions = async () => {
    // List users and their received transactions
    const usersWithReceivedTransactions = await prisma.user.findMany({
      include: {
        transactionsTo: true, // Include transactions where the user is the recipient
      },
    });

    console.log(
      "Users with Received Transactions:",
      usersWithReceivedTransactions
    );
  };

  listUsersAndReceivedTransactions().catch((error) => {
    console.error(error);
  });

  // Example: ADVANCED SEARCH - LIST USERS RECEIVING TRANSACTIONS > 500 AND COUNTRY = 'EG'
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   SELECT
     "User".id,
     "User".username,
     "User".email,
     "User".balance,
     "User".country,
     "User".createdAt,
     "UserTransaction".id AS transactionId,
     "UserTransaction".amount,
     "UserTransaction".description,
     "UserTransaction".createdAt AS transactionCreatedAt,
     "UserTransaction".senderId,
     "UserTransaction".recipientId
   FROM "User"
   JOIN "UserTransaction" ON "User".id = "UserTransaction".recipientId
   WHERE "User".country = 'EG' AND "UserTransaction".amount > 500;
*/

  const advancedSearchUsers = async () => {
    // List users receiving transactions > 500 and with country = 'EG'
    const advancedSearchResults = await prisma.user.findMany({
      where: {
        country: "EG", // Filter users by country 'EG'
        transactionsTo: {
          some: {
            amount: {
              gt: 500, // Filter received transactions with amount > 500
            },
          },
        },
      },
      include: {
        transactionsTo: true, // Include transactions where the user is the recipient
      },
    });

    console.log(
      "Users with Received Transactions > 500 (Country: EG):",
      advancedSearchResults
    );
  };

  advancedSearchUsers().catch((error) => {
    console.error(error);
  });

  // Example: AGGREGATIONS - CALCULATE TOTAL BALANCE AND AVERAGE AGE
  // Equivalent PostgreSQL code:
  /* SQL Equivalent:
   -- Calculate total balance of all users
   SELECT SUM(balance) AS totalBalance FROM "User";

   -- Calculate average age of all users
   SELECT AVG(age) AS averageAge FROM "User";
*/

  const calculateAggregations = async () => {
    // Calculate total balance of all users
    const totalBalanceResult = await prisma.user.aggregate({
      _sum: {
        balance: true,
      },
    });

    console.log(
      "Total Balance of All Users:",
      totalBalanceResult._sum?.balance
    );

    // Calculate average age of all users
    const averageAgeResult = await prisma.user.aggregate({
      _avg: {
        age: true,
      },
    });

    console.log("Average Age of All Users:", averageAgeResult._avg?.age);
  };

  calculateAggregations().catch((error) => {
    console.error(error);
  });

  // Example: GROUP BY - INSERT USERS AND CALCULATE TOTAL USERS AND AVERAGE AGE PER COUNTRY
  // Equivalent PostgreSQL code
  /* SQL Equivalent:
  SELECT
     "User".country,
     COUNT(*) AS totalUsers,
     AVG(age) AS averageAge
   FROM "User"
   GROUP BY "User".country;
*/

  const insertUsers = async () => {
    const usersData = [
      {
        age: 25,
        email: "john_doe@example.com",
        username: "john_doe",
        balance: 1000,
        country: "USA",
      },
      {
        age: 28,
        email: "emily_smith@example.com",
        username: "emily_smith",
        balance: 1500,
        country: "USA",
      },
      {
        age: 30,
        email: "ali_khan@example.com",
        username: "ali_khan",
        balance: 2000,
        country: "Pakistan",
      },
      {
        age: 22,
        email: "maria_garcia@example.com",
        username: "maria_garcia",
        balance: 1200,
        country: "Spain",
      },
      {
        age: 26,
        email: "antonio_lee@example.com",
        username: "antonio_lee",
        balance: 1800,
        country: "Spain",
      },
    ];

    const createdUsers = await prisma.user.createMany({
      data: usersData,
    });

    console.log("Created users:", createdUsers);
  };

  const calculateGroupBy = async () => {
    // Insert users in different countries
    await insertUsers();

    // Calculate total users and average age per country
    const groupByResults = await prisma.user.groupBy({
      by: ["country"], // Group by country
      _count: {
        // Calculate total users per country
        country: true,
      },
      _avg: {
        // Calculate average age per country
        age: true,
      },
    });

    console.log(
      "Group By Results (Total Users and Average Age per Country):",
      groupByResults
    );
  };

  calculateGroupBy().catch((error) => {
    console.error(error);
  });
}

main();
