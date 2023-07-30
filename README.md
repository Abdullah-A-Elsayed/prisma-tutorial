# learn prisma

## How to run examples?

```shell
    docker-compose up
```

in another terminal:

```
    yarn dev
```

## Tutorial Code Description: Prisma ORM Examples

1. **Create Users**: Demonstrates how to create users using Prisma.

2. **List Users**: Fetches and displays all users using Prisma.

3. **Update User**: Updates a user's age using Prisma.

4. **Delete User**: Deletes a user using Prisma.

5. **Insert Multiple Users**: Inserts multiple users with initial balances using Prisma.

6. **Make Transactions**: Performs transactions between users, updating balances, and creating transaction records.

7. **List Users with Received Transactions**: Lists users along with their received transactions using Prisma's relations.

8. **Advanced Search**: Filters users who received transactions greater than 500 and have a specific country.

9. **Aggregations**: Calculates the total balance of all users and the average age using Prisma's aggregate feature.

10. **GroupBy**: Inserts users in different countries and calculates total users and average age per country using Prisma's GroupBy feature.

## for more details check

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql
