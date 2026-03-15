// import { Test, TestingModule } from '@nestjs/testing';
// import { AppService } from 'src/modules/app/app.service';
// import { App } from 'src/modules/app/entity/app.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { CreateAppData } from 'src/modules/app/dto/create.dto';
// import { DataHandler } from './entity/data.class';
// import { AppStatus } from 'src/modules/app/enum/app.enum';
// import { ObjectId } from 'mongodb';
// import { UseGuards } from '@nestjs/common';
// import { RolesGuard } from 'src/common/guards/auth/roles.guard';
// import { AuthGuard } from 'src/common/guards/auth/auth.guard';
// import { JWTAuthStrategy } from 'src/common/guards/auth/jwt-auth.strategy';
// import { BasicAuthStrategy } from 'src/common/guards/auth/basic-auth.strategy';
// import { AppController } from 'src/modules/app/app.controller';
// import { UpdateAppData } from 'src/modules/app/dto/update-one.dto';

// describe('AppService', () => {
//     let controller: AppController;
//     const mockRepository = {
//         findOne: jest.fn(),
//         findManyWithPaging: jest.fn(),
//         createOne: jest.fn(),
//         updateOne: jest.fn(),
//         deleteOne: jest.fn(),
//     };
//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [AppController],
//             providers: [
//                 {
//                     provide: AppService,
//                     useValue: mockRepository,
//                 },
//                 RolesGuard, AuthGuard,
//             ],

//         })
//             .overrideGuard(UseGuards(AuthGuard))
//             .useValue(RolesGuard)
//             .compile();

//         controller = module.get<AppController>(AppController);
//     });

//     it('should be defined', () => {
//         expect(controller).toBeDefined();
//     });
//     it('create => Should create a new user and return its data', async () => {
//         // arrange
//         const createUserDto: CreateAppData = {
//             name: 'Chadwick',
//             origins: ['Boseman'],
//             description: 'chadwickboseman@email.com',
//             status: AppStatus.Inactive,
//             createdBy: null,
//             createdAt: new Date(),
//             owner: {
//                 userId: "16c256a3-3705-4688-8804-0482867381c4",
//                 orgId: "228"
//             }
//         };
//         const app = new App()
//         const handler: DataHandler = new DataHandler();

//         jest.spyOn(mockRepository, 'createOne').mockReturnValue(app);
//         const id = "661e318a4b6b11895e384f36"
//         // act
//         const result = await controller.createOne(createUserDto, handler);
//         // assert
//         expect(mockRepository.createOne).toBeCalled();
//         expect(mockRepository.createOne).toBeCalledWith(createUserDto, handler);
//     });
//     it('findMany => Should findMany a new app and return its data', async () => {
//         // arrange
//         const app = new App()
//         const handler: DataHandler = new DataHandler();

//         jest.spyOn(mockRepository, 'findManyWithPaging').mockReturnValue(app);
//         let queries;
//         // act
//         const result = await controller.findManyWithPaging(queries, handler);
//         // assert
//         expect(result).toEqual(app);
//         expect(mockRepository.findManyWithPaging).toBeCalled();
//         expect(mockRepository.findManyWithPaging).toBeCalledWith({ "order": {}, "paging": { "index": 0, "size": 25 }, "select": [], "where": undefined }, handler);
//     });
//     it('findOne => Should findOne a new app and return its data', async () => {
//         // arrange
//         const app = new App()
//         const handler: DataHandler = new DataHandler();

//         jest.spyOn(mockRepository, 'findOne').mockReturnValue(app);
//         const id = "661e318a4b6b11895e384f36"
//         // act
//         const result = await controller.findOne(id, handler);
//         // assert
//         expect(result).toEqual(app);
//         expect(mockRepository.findOne).toBeCalled();
//         expect(mockRepository.findOne).toBeCalledWith(id, handler);
//     });
//     it('updateOne => Should update a new app and return its data', async () => {
//         // arrange
//         const updateData = new UpdateAppData()
//         updateData.name = 'Chadwick';
//         updateData.description = 'chadwickboseman@email.com';
//         updateData.status = AppStatus.Inactive;

//         const app = new App()
//         const handler: DataHandler = new DataHandler();

//         jest.spyOn(mockRepository, 'updateOne').mockReturnValue(app);
//         const id = "661e318a4b6b11895e384f36"
//         // act
//         const result = await controller.updateOne(id, updateData, handler);
//         // assert
//         expect(result).toEqual(app);
//         expect(mockRepository.updateOne).toBeCalled();
//         expect(mockRepository.updateOne).toBeCalledWith(id, updateData, handler);
//     });
//     it('findOne => Should findOne a new app and return its data', async () => {
//         // arrange
//         const app = new App()
//         const handler: DataHandler = new DataHandler();

//         jest.spyOn(mockRepository, 'deleteOne').mockReturnValue(app);
//         const id = "661e318a4b6b11895e384f36"
//         // act
//         const result = await controller.deleteOne(id, handler);
//         // assert
//         expect(result).toEqual(app);
//         expect(mockRepository.deleteOne).toBeCalled();
//         expect(mockRepository.deleteOne).toBeCalledWith(id, handler);
//     });
// });
