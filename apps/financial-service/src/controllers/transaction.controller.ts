import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { TransactionService } from '../services/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body()
    body: {
      tenantId?: string;
      accountId?: string;
      transactionType?: 'income' | 'expense';
      amount?: number;
      sourceModule?: string;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.transactionService.registerTransaction(
      CreateTransactionDto.from(body),
    );
  }

  @Get()
  list(
    @Query('tenantId') tenantId: string | undefined,
    @Query('accountId') accountId: string | undefined,
    @Query('transactionType') transactionType: string | undefined,
  ) {
    return this.transactionService.listTransactions(
      ListTransactionsQueryDto.from({
        tenantId,
        accountId,
        transactionType,
      }),
    );
  }
}
