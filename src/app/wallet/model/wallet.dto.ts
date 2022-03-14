export interface BalanceDto {
  address: string,
  availableBalance: number,
  pendingReceivedBalance: number,
  network: string
}

export interface TransactionRequirementsDto {
  minTransactionAmount: number,
  maxTransactionAmount: number,
  transactionFeePercent: number,
  network: string
}

export interface TransactionFeeDto {
  additionalFee: number;
  maxCustomNetworkFee: number;
  minCustomNetworkFee: number;
  networkFee: number;
  transactionSize: number;
  network: string;
}

export interface SubmittedTransactionDto {
  transactionId: string,
  network: string
}

export interface SummarizedTransactionDto {
  amountToSend: number;
  additionalFee: number;
  networkFee: number;
}
