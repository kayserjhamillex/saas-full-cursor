import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { ListAccountsQueryDto } from './dto/list-accounts-query.dto';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(
    @Body()
    body: {
      tenantId?: string;
      name?: string;
      accountType?: string;
      currency?: string;
      initialBalance?: number;
    },
  ) {
    return this.accountService.createAccount(CreateAccountDto.from(body));
  }

  @Get()
  list(@Query('tenantId') tenantId: string | undefined) {
    const query = ListAccountsQueryDto.from({ tenantId });
    return this.accountService.listAccounts(query.tenantId);
  }
}
