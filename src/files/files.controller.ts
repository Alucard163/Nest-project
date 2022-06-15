import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { FileElementResponse } from "./dto/file-element.response";
import { FilesService } from "./files.service";
import { MFile } from "./mFile.class";

@Controller('files')
export class FilesController {
  constructor(private readonly filesServie: FilesService) {
  }
  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
      const saveArray = [new MFile(file)];
      if (file.mimetype.includes('image')) {
          const buffer = await this.filesServie.convertToWebP(file.buffer);
          saveArray.push(new MFile({
            originalname: `${file.originalname.split('.')[0]}.webp`,
            buffer
          }))
      }
      return this.filesServie.saveFiles(saveArray);
  }
}
