import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';



 
@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule, MatMenuModule, MatButtonModule],
    declarations: [HeaderComponent, FooterComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [],
    exports: [HeaderComponent, FooterComponent],
})
export class UiModule {}