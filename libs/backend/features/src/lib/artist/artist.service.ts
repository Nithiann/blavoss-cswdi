import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ArtistDocument } from "@blavoss-cswdi/backend/data-access";
import { BehaviorSubject } from "rxjs";
import { IArtist } from "@blavoss-cswdi/shared/api";
import * as fs from 'fs';

@Injectable()
export class ArtistService {

    constructor(@InjectModel('Artist') private readonly artistModel: Model<ArtistDocument>) {}

    TAG = 'ArtistService';

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
            const artist = await this.artistModel.findById(id).exec();
    
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

    async create(artist: Pick<IArtist, 'name' | 'description' | 'genre' | 'image' | 'Festivals'>): Promise<IArtist> {
        Logger.log(`create(${JSON.stringify(artist)})`, this.TAG);

        if (artist.image) {
            const baseImage = this.convertImageToBase64(artist.image);
            artist.image = baseImage;
        }

        const newArtist = new this.artistModel({...artist});

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

    private convertImageToBase64(imagePath: string): string {
        const fileBuffer = fs.readFileSync(imagePath);
         
        const base64Image = fileBuffer.toString('base64');

        return base64Image;
    }
}