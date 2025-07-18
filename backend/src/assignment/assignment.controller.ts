import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Body(new ValidationPipe()) dto: CreateAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.assignmentService.findAll();
  }

  @Get('with-remaining-days')
  findAllWithRemainingDays() {
    return this.assignmentService.findAllWithRemainingDays();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) dto: UpdateAssignmentDto) {
    return this.assignmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.remove(id);
  }
} 