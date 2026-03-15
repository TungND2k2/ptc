import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { ReportService } from './report.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Controllers } from 'src/common/enums/controllers';
import { Services } from 'src/common/enums/services';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindReportByIdResult } from './dto/find-one.dto';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';

@ServiceInfo(Services.BSM)
@ControllerInfo(Controllers.BSM_Report)
@Controller(Controllers.BSM_Report)
export class ReportController extends BaseController {
  constructor(private readonly reportService: ReportService) {
    super(reportService);
  }

  // @Get('/revenue-by-products')
  // @UseGuards(AuthGuard, RolesGuard)
  // async revenueByProducts(
  //   //@Body() data: CreateCustomerData,
  //   @Query('year') year: number,
  //   @Query('month') month: number,
  //   @Req() req,
  // ): Promise<any> {
  //   const handler = req.user || new DataHandler();
  //   const currentYear = new Date().getFullYear();
  //   const currentMonth = new Date().getUTCMonth();
  //   if (!year) {
  //     year = currentYear;
  //   }
  //   if (!month) {
  //     month = currentMonth + 1;
  //   }
  //   console.log(year, month);
  //   return await this.reportService.revenueByProducts(year, month, handler);
  // }
  // @Get(':id')
  // @UseGuards(AuthGuard, RolesGuard)
  // async findOne(
  //   @Param('id') id: string,
  //   @Req() req,
  // ): Promise<FindReportByIdResult> {
  //   return await super.findOne(id, req);
  // }

  // @Get()
  // @UseGuards(AuthGuard, RolesGuard)
  // async findManyWithPaging(
  //   @Query() queries: string,
  //   @Req() req,
  // ): Promise<FindAllResult<FindReportByIdResult>> {
  //   return await super.findManyWithPaging(queries, req);
  // }
}
