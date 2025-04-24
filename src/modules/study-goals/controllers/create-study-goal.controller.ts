// src/modules/study-goals/controllers/create-study-goal.controller.ts
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CreateStudyGoalService } from '../services';
import { CreateStudyGoalDto } from '../model/dto';
import { IStudyGoal } from '../model/interfaces';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Controlador para crear objetivos de estudio
 */
@Controller('study-goals')
@UseGuards(JwtAuthGuard)
export class CreateStudyGoalController {
  constructor(
    private readonly createStudyGoalService: CreateStudyGoalService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(CreateStudyGoalController.name);
  }

  /**
   * Crea un nuevo objetivo de estudio
   * @param createStudyGoalDto Datos para la creación
   * @returns Objetivo de estudio creado
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() createStudyGoalDto: CreateStudyGoalDto): Promise<IStudyGoal> {
    this.logger.log(`Creando nuevo objetivo de estudio: ${createStudyGoalDto.name}`);
    return this.createStudyGoalService.execute(createStudyGoalDto);
  }
}