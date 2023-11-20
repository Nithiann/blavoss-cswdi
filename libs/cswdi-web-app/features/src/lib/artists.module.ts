import { NgModule } from "@angular/core";
import { ArtistService } from "./artist/artist.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ArtistCreateComponent } from "./artist/artist-create/artist-create.component";
import { ArtistListComponent } from "./artist/artist-list/artist-list.component";
import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
import { RouterModule } from "@angular/router";
import { routes } from "./user/user-routing.module";

@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes)],
    declarations: [ArtistCreateComponent, ArtistListComponent, ArtistDetailComponent],
    providers: [ArtistService],
    exports: [ArtistCreateComponent, ArtistListComponent, ArtistDetailComponent],
})

export class ArtistModule {}