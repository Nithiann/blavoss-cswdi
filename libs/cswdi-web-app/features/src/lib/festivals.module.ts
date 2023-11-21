import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./festival/festival-routing.module";
import { FestivalListComponent } from "./festival/festival-list/festival-list.component";
import { FestivalCreateComponent } from "./festival/festival-create/festival-create.component";
import { FestivalDetailComponent } from "./festival/festival-detail/festival-detail.component";
import { FestivalService } from "./festival/festival.service";

@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes)],
    declarations: [FestivalListComponent, FestivalCreateComponent, FestivalDetailComponent],
    providers: [FestivalService],
    exports: [FestivalCreateComponent, FestivalDetailComponent, FestivalListComponent, RouterModule]
})

export class FestivalsModule {}