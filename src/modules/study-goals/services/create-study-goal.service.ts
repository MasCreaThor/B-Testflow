// src/modules/study-goals/services/create-study-goal.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { StudyGoalRepository } from '../infra/repositories';
import { CategoryRepository } from '../../categories/infra/repositories/category.repository';
import { CreateStudyGoalDto } from '../model/dto';
import { IStudyGoal } from '../model/interfaces';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Servicio para crear objetivos de estudio
 */
@Injectable()
export class CreateStudyGoalService {
  constructor(
    private readonly studyGoalRepository: StudyGoalRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(CreateStudyGoalService.name);
  }

  /**
   * Crea un nuevo objetivo de estudio
   * @param createStudyGoalDto Datos para la creación
   * @returns Objetivo de estudio creado
   * @throws BadRequestException si la categoría no existe
   * @throws InternalServerErrorException si ocurre un error en la creación
   */
  async execute(createStudyGoalDto: CreateStudyGoalDto): Promise<IStudyGoal> {
    try {
      // Verificar si la categoría existe (si se proporciona)
      if (createStudyGoalDto.categoryId) {
        this.logger.debug(`Verificando existencia de categoría: ${createStudyGoalDto.categoryId}`);
        const category = await this.categoryRepository.findById(createStudyGoalDto.categoryId);
        
        if (!category) {
          this.logger.warn(`La categoría con ID ${createStudyGoalDto.categoryId} no existe`);
          throw new BadRequestException(`La categoría con ID ${createStudyGoalDto.categoryId} no existe`);
        }
      }
      
      this.logger.debug(`Creando nuevo objetivo de estudio: ${createStudyGoalDto.name}`);
      const newGoal = await this.studyGoalRepository.create(createStudyGoalDto);
      this.logger.log(`Objetivo de estudio creado con ID: ${newGoal._id}`);
      
      return newGoal;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Error al crear objetivo de estudio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al crear el objetivo de estudio');
    }
  }
}