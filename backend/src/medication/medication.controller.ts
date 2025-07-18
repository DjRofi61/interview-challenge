import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto, UpdateMedicationDto } from './medication.dto';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  create(@Body(new ValidationPipe()) dto: CreateMedicationDto) {
    return this.medicationService.create(dto);
  }

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) dto: UpdateMedicationDto) {
    return this.medicationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicationService.remove(id);
  }
} 