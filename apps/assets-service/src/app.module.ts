import { Module } from "@nestjs/common";
import { AssetsModule } from "./assets/assets.module";

@Module({
  imports: [AssetsModule],
})
export class AppModule {}
