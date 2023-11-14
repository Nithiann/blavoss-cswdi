import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

 
@NgModule({
    imports: [CommonModule, HttpClientModule],
    declarations: [HeaderComponent, FooterComponent],
    providers: [],
    exports: [HeaderComponent, FooterComponent],
})
export class UiModule {}