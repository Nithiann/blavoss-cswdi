import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';




 
@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule, MatMenuModule, MatButtonModule],
    declarations: [HeaderComponent, FooterComponent],
    providers: [],
    exports: [HeaderComponent, FooterComponent],
})
export class UiModule {}