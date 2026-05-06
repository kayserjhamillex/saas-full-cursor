import { Module } from '@nestjs/common';
import { AccountController } from '../controllers/account.controller';
import { ReportController } from '../controllers/report.controller';
import { TransactionController } from '../controllers/transaction.controller';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { FinancialRepository } from '../repositories/financial.repository';
import { AccountService } from '../services/account.service';
import { DatabaseService } from '../services/database.service';
import { ReportService } from '../services/report.service';
import { TransactionRunnerService } from '../services/transaction-runner.service';
import { TransactionService } from '../services/transaction.service';

@Module({
  controllers: [AccountController, TransactionController, ReportController],
  providers: [
    DatabaseService,
    FinancialRepository,
    AccountService,
    TransactionService,
    ReportService,
    TransactionRunnerService,
    InternalServiceTokenGuard,
  ],
})
export class FinancialModule {}
