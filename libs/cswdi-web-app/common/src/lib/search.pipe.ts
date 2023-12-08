import { Pipe, PipeTransform } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(entity: IFestival[] | null, searchTerm: string): IFestival[] | null {
    if (!entity || !searchTerm.trim()) {
      return entity;
    }

    return entity.filter(entit =>
      entit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}