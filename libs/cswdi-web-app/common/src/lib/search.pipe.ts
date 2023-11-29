import { Pipe, PipeTransform } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(festivals: IFestival[] | null, searchTerm: string): IFestival[] | null {
    if (!festivals || !searchTerm.trim()) {
      return festivals;
    }

    return festivals.filter(festival =>
      festival.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}