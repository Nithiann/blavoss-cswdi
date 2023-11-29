import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FestivalDocument } from "@blavoss-cswdi/backend/data-access";
import { BehaviorSubject } from "rxjs";
import { IFestival, ITicket } from "@blavoss-cswdi/shared/api";

@Injectable()
export class FestivalService {

    constructor(@InjectModel('Festival') private readonly festivalModel: Model<FestivalDocument>) {}

    TAG = 'Backend FestivalService';

    private festivals$ = new BehaviorSubject<IFestival[]>([
        
    ]);

    async getAll(): Promise<IFestival[]> {
        Logger.log('getAll', this.TAG);

        const festivals = await this.festivalModel.find().exec();

        return festivals.map(festival => festival.toObject());
    }

    async getOne(id: string): Promise<IFestival> {
        Logger.log(`getOne(${id})`, this.TAG);
        try {
            const festival = await this.festivalModel.findById(id).populate('artists').exec();

            if (!festival) {
                throw new NotFoundException('Festival could not be found');
            }

            return festival.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async delete(id: string): Promise<IFestival> {
        Logger.log(`delete(${id})`, this.TAG);
        try {
            const festival = await this.festivalModel.findByIdAndDelete(id).exec();
        
            if (!festival) {
                throw new NotFoundException('Festival could not be found');
            }

            return festival.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async create(festival: Pick<IFestival, 'name' | 'location' | 'startDate' | 'endDate' | 'description' | 'ticketPrice' | 'image' | 'genre' | 'artists'>): Promise<IFestival> {
        Logger.log(`create(${JSON.stringify(festival)})`, this.TAG);

        const newFestival = new this.festivalModel({...festival});

        const result = await newFestival.save();

        return result.toObject();
    }

    async update(id: string, festival: Partial<IFestival>): Promise<IFestival> {
        Logger.log(`update(${id}, ${JSON.stringify(festival)})`, this.TAG);

        try {
            const updateFestival = await this.festivalModel.findByIdAndUpdate(id, festival, { new: true, runValidators: true }).exec();
            if (!updateFestival) {
                throw new NotFoundException('Festival could not be found');
            }
            return updateFestival.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async addArtistToFestival(festivalId: string, artistId: string): Promise<IFestival> {
        Logger.log(`addArtistToEvent(${festivalId}, ${artistId})`, this.TAG);

        try {
            const festival = await this.festivalModel.findById(festivalId).exec();

            if (!festival) {
                throw new NotFoundException('Festival could not be found');
            }

            const artistObjectId = new Types.ObjectId(artistId);

            if (!festival.artists.includes(artistObjectId)) {
                festival.artists.push(artistObjectId);
                await festival.save();
            }

            return festival.toObject();

        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async addTicketToFestival(ticket: ITicket): Promise<IFestival> {
        Logger.log(`addTicketToEvent(${ticket.festivalId}, ${ticket._id})`, this.TAG);
        try {
            const festival = await this.festivalModel.findById(ticket.festivalId).exec();

            if (!festival) {
                throw new NotFoundException('Festival could not be found');
            }

            const ticketObjectId = new Types.ObjectId(ticket._id);

            if (!festival.tickets.includes(ticketObjectId)) {
                festival.tickets.push(ticketObjectId);
                await festival.save();
            }

            return festival.toObject();

        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async removeArtistFromFestival(festivalId: string, artistId: string): Promise<IFestival> {
        Logger.log(`removeArtistFromEvent(${festivalId}, ${artistId})`, this.TAG);
        try {
            const festival = await this.festivalModel.findById(festivalId).exec();

            if (!festival) {
                throw new NotFoundException('Festival could not be found');
            }
            const artistObjectId = new Types.ObjectId(artistId);
            festival.artists = festival.artists.filter(artist => !artist.equals(artistObjectId));

            await festival.save();

            return festival.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }
}