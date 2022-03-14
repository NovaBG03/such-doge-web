export interface Balance {
  address: string,
  availableBalance: number,
  pendingReceivedBalance: number,
  network: string
}

export interface TransactionRequirements {
  minTransactionAmount: number,
  maxTransactionAmount: number,
  transactionFeePercent: number,
  network: string
}

export interface TransactionFee {
  additionalFee: number;
  maxCustomNetworkFee: number;
  minCustomNetworkFee: number;
  networkFee: number;
  transactionSize: number;
  network: string;
}

export interface Transaction {
  amount: number;
  priority: string;
}

export interface SummarizedTransaction {
  amountToSend: number;
  additionalFee: number;
  networkFee: number;
}

export interface SubmittedTransaction {
  transactionId: string,
  network: string
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}
