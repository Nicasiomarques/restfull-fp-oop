import { models, Model, Document } from "mongoose";

export default class ModalFactory<T> {
  private model: Model<Document & T>;

  constructor(modalName: string) {
    this.model = models[modalName]
  }

  public async createRecord(data: T): Promise<T> {
    const dataCreated = new this.model(data)
    await dataCreated.save()
    return data;
  }

  public async getAllRecords(): Promise<T[]> {
    const records = await this.model.find()
    return records
  }

  public async getPostById(id: string): Promise<T> {
    const record = await this.model.findById(id)
    return record
  }

  public async modifyPost(id: string, data: T): Promise<T> {
    const record = await this.model.findByIdAndUpdate(id, data, { new: true })
    return record
  }

  public async deletePost(id: string): Promise<void> {
    await this.model.findByIdAndRemove(id)
  }
}