import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ArtistDocument } from "@blavoss-cswdi/backend/data-access";
import { BehaviorSubject } from "rxjs";
import { IArtist } from "@blavoss-cswdi/shared/api";
import * as fs from 'fs';

@Injectable()
export class ArtistService {

    constructor(@InjectModel('Artist') private readonly artistModel: Model<ArtistDocument>) {}

    TAG = 'Backend ArtistService';

    private artists$ = new BehaviorSubject<IArtist[]>([ 
    ]);

    async getAll(): Promise<IArtist[]> {
        Logger.log('getAll', this.TAG);

        const artists = await this.artistModel.find().exec();

        return artists.map(artist => artist.toObject());
    }

    async getOne(id: string): Promise<IArtist> {
        Logger.log(`getOne(${id})`, this.TAG);
        try {
            const artist = await this.artistModel.findById(id).populate('festivals').exec();
    
            if (!artist) {
                throw new NotFoundException('Artist could not be found');
            }
    
            return artist.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async delete(id: string): Promise<IArtist> {
        Logger.log(`delete(${id})`, this.TAG);
        try {
            const artist = await this.artistModel.findByIdAndDelete(id).exec();
        
            if (!artist) {
                throw new NotFoundException('Artist could not be found');
            }

            return artist.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async create(artist: Pick<IArtist, 'name' | 'description' | 'genre' | 'image' | 'festivals'>): Promise<IArtist> {
        Logger.log(`create(${JSON.stringify(artist)})`, this.TAG);

        const newArtist = new this.artistModel({
            ...artist
        });

        const result = await newArtist.save();

        return result.toObject();
    }

    async update(id: string, updatedArtist: Partial<IArtist>): Promise<IArtist> {
        Logger.log(`update(${id}, ${JSON.stringify(updatedArtist)})`, this.TAG);

        try {
            const updateArtist = await this.artistModel.findByIdAndUpdate(id, updatedArtist, { new: true, runValidators: true }).exec();
            if (!updateArtist) {
                throw new NotFoundException('Artist could not be found');
            }
            return updateArtist.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async addFestivalToArtist(id: string, festivalId: string): Promise<IArtist> {
        Logger.log(`addFestivalToArtist(${id}, ${festivalId})`, this.TAG);
        try {
            const artist = await this.artistModel.findById(id).exec();
            if (!artist) {
                throw new NotFoundException('Artist could not be found');
            }

            const festivalObjectId  = new Types.ObjectId(festivalId);

            if(!artist.festivals.includes(festivalObjectId)) {
                artist.festivals.push(festivalObjectId);
                await artist.save();
            }

            return artist.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async removeFestivalFromArtist(id: string, festivalId: string): Promise<IArtist> {
        Logger.log(`removeFestivalFromArtist(${id}, ${festivalId})`, this.TAG);
        try {
            const artist = await this.artistModel.findById(id).exec();
            if (!artist) {
                throw new NotFoundException('Artist could not be found');
            }
            const festivalObjectId = new Types.ObjectId(festivalId);
            artist.festivals = artist.festivals.filter(festival => !festival.equals(festivalObjectId));

            await artist.save();

            return artist.toObject();

        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async ListNotInFestival(festivalId: string): Promise<IArtist[]> {
        Logger.log(`ListNotInFestival(${festivalId})`, this.TAG);
        try {
            const artistsInFestival = await this.artistModel.find({ festivals: new Types.ObjectId(festivalId) }).exec();
            const allArtists = await this.artistModel.find().exec();
            const artistsNotInFestival = allArtists.filter(artist => !artistsInFestival.some(a => a._id.equals(artist._id)));

            return artistsNotInFestival.map(artist => artist.toObject());
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    private convertImageToBase64(imagePath: string): string {
        const fileBuffer = fs.readFileSync(imagePath);
         
        const base64Image = fileBuffer.toString('base64');

        return base64Image;
    }
}