"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { CreateTransactionProps, getTransactionsByBankIdProps } from "@/types";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createRow({
      databaseId: DATABASE_ID!,
      tableId: TRANSACTION_COLLECTION_ID!,
      rowId: ID.unique(), 
      data:  {
        channel: 'online',
        category: 'Transfer',
        ...transaction
      }
    })
    
    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();

    const senderTransactions = await database.listRows({
     databaseId: DATABASE_ID!,
     tableId:  TRANSACTION_COLLECTION_ID!,
     queries:  [Query.equal('senderBankId', bankId)],
    })

    const receiverTransactions = await database.listRows({
      databaseId: DATABASE_ID!,
     tableId:  TRANSACTION_COLLECTION_ID!,
     queries:  [Query.equal('receiverBankId', bankId)],
    });

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      rows: [
        ...senderTransactions.rows, 
        ...receiverTransactions.rows,
      ]
    }
    console.log(transactions)

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}