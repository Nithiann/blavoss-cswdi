import { NgModule } from "@angular/core";
import { ArtistService } from "./artist/artist.service";
import { AuthService, TokenInterceptor } from "@blavoss-cswdi/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ArtistCreateComponent } from "./artist/artist-create/artist-create.component";
import { ArtistListComponent } from "./artist/artist-list/artist-list.component";
import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
import { RouterModule } from "@angular/router";
import { routes } from "./artist/artist-routing.module";
import { ArtistUpdateComponent } from "./artist/artist-update/artist-update.component";

@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes)],
    declarations: [ArtistCreateComponent, ArtistListComponent, ArtistDetailComponent, ArtistUpdateComponent],
    providers: [ArtistService, AuthService, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }],
    exports: [ArtistCreateComponent, ArtistListComponent, ArtistDetailComponent, ArtistUpdateComponent, RouterModule],
})

export class ArtistModule {}