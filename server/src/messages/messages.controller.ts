import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rooms/:roomId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  findAll(@Param('roomId') roomId: string, @Request() req) {
    return this.messagesService.findByRoom(roomId, req.user.id);
  }

  @Post()
  create(
    @Param('roomId') roomId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    return this.messagesService.create({
      roomId,
      userId: req.user.id,
      content: createMessageDto.content,
    });
  }
}

