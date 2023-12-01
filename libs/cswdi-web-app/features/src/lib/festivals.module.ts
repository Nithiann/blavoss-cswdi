import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./festival/festival-routing.module";
import { FestivalListComponent } from "./festival/festival-list/festival-list.component";
import { FestivalCreateComponent } from "./festival/festival-create/festival-create.component";
import { FestivalDetailComponent } from "./festival/festival-detail/festival-detail.component";
import { FestivalService } from "./festival/festival.service";
import { FestivalAddArtistComponent } from "./festival/festival-add-artist/festival-add-artist.component";
import { ArtistService } from "./artist/artist.service";
import { AuthService, TokenInterceptor } from "@blavoss-cswdi/common";
import { UiModule } from "@blavoss-cswdi/ui";

@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes), UiModule],
    declarations: [FestivalListComponent, FestivalCreateComponent, FestivalDetailComponent, FestivalAddArtistComponent],
    providers: [FestivalService, ArtistService, AuthService,{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }], 
    exports: [FestivalCreateComponent, FestivalDetailComponent, FestivalListComponent, FestivalAddArtistComponent, RouterModule]
})

export class FestivalsModule {}