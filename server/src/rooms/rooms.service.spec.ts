import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository';

describe('RoomsService', () => {
  let service: RoomsService;
  let repository: RoomsRepository;

  const mockRoom = {
    _id: 'room123',
    name: 'Test Room',
    participants: ['user123'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: RoomsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            addParticipant: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    repository = module.get<RoomsRepository>(RoomsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a room', async () => {
      (repository.create as jest.Mock).mockResolvedValue(mockRoom);

      const result = await service.create({ name: 'Test Room' }, 'user123');

      expect(result).toEqual(mockRoom);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Test Room',
        participants: ['user123'],
      });
    });
  });

  describe('findOne', () => {
    it('should return room if user is participant', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockRoom);

      const result = await service.findOne('room123', 'user123');

      expect(result).toEqual(mockRoom);
    });

    it('should throw NotFoundException if room not found', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('room123', 'user123')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not participant', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockRoom);

      await expect(service.findOne('room123', 'otheruser')).rejects.toThrow(ForbiddenException);
    });
  });
});

