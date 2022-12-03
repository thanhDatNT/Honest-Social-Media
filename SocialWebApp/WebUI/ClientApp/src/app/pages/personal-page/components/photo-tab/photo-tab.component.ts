import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, Input, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { IUser } from 'src/app/interface/user';

@Component({
  selector: 'app-photo-tab',
  templateUrl: './photo-tab.component.html',
  styleUrls: ['./photo-tab.component.scss']
})
export class PhotoTabComponent implements OnInit {
  @Input() user: IUser | undefined;
  constructor(private photoService: PhotoService, private jwtHelper: JwtHelperService) {}
  photos: any = [];
  isLoading: boolean = false;
  hasNextPage: boolean = false;
  limit: number = 6;
  offset: number = 0;
  scrollable: boolean = false;
  ngOnInit(): void {
    this.fetchPhotos();
  }

  seeAll() {
    this.scrollable = true;
    this.fetchPhotos();
  }
  fetchPhotos(): void {
    if (this.user) {
      this.isLoading = true;
      this.photoService.getUserPhotos(this.user.id as number, this.offset, this.limit).subscribe({
        next: (res: any) => {
          this.photos = [...this.photos, ...res.photos];
          this.hasNextPage = res.hasNextPage;
          this.isLoading = false;
          this.offset += this.limit;
        },
        error: error => {
          console.log({ error });
          this.isLoading = false;
        }
      });
    }
  }

  onScroll() {
    if (this.hasNextPage && !this.isLoading) {
      this.fetchPhotos();
    }
  }
}
