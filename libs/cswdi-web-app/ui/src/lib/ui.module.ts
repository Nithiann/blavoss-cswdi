import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { FestivalItemComponent } from "./festival-item/festival-item.component";
import { MenuModule } from 'primeng/menu';
import { CarouselComponent } from "./carousel/carousel.component";
import { CarouselModule } from 'primeng/carousel';

 
@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule, MenuModule, CarouselModule],
    declarations: [HeaderComponent, FooterComponent, FestivalItemComponent, CarouselComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [],
    exports: [HeaderComponent, FooterComponent, FestivalItemComponent, CarouselComponent],
})
export class UiModule {}