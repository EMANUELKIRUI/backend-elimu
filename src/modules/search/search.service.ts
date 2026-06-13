import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  health() {
    return { ok: true };
  }
}
