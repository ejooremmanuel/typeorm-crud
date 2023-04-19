import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Address } from "../entity/address.entity";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.address", "address")
      .getMany();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age, address } = request.body;

    try {
      if (!firstName || !lastName || !age) {
        return response.status(400).json({
          success: false,
          message: "please add a request body",
        });
      }

      const userAddress = Object.assign(new Address(), {
        address,
      } as Address);

      const user = Object.assign(new User(), {
        firstName,
        lastName,
        age,
        address: userAddress,
      } as User);

      return this.userRepository.save(user);
    } catch (error) {}
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.userRepository
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id=:id", { id })
      .execute();

    return "user has been removed";
  }
  async removeMany(request: Request, response: Response, next: NextFunction) {
    await this.userRepository.clear();

    return "user has been removed";
  }
  async update(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age, address } = request.body;
    const id = parseInt(request.params.id);

    let userToUpdate = await this.userRepository.findOneBy({ id });

    if (!userToUpdate) {
      return response.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    await this.userRepository
      .createQueryBuilder("user")
      .update(User)
      .set({ address, firstName, lastName, age })

      .where("id=:id", { id })
      .execute();

    return "user has been removed";
  }
}
