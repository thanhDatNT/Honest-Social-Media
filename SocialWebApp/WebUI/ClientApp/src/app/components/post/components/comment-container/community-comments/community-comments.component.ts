import { Component, Input, OnInit } from '@angular/core';
import { IUserCommented } from '../../../../../interface/user';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-comments',
  templateUrl: './community-comments.component.html',
  styleUrls: ['./community-comments.component.scss']
})
export class CommunityCommentsComponent implements OnInit {
  @Input() userCommentList!: IUserCommented[];
  expanded: boolean = false;
  mockImg: string = environment.mockImg;

  constructor(private route: Router) {}

  ngOnInit(): void {
    const i = this.userCommentList.sort((a, b) => {
      return a.createdAt > b.createdAt ? 1 : 0;
    });
  }

  onToggleViewMore() {
    this.expanded = !this.expanded;
  }

  handleNavigateAccount(userId: number) {
    this.route.navigateByUrl(`/profile/${userId}`, { skipLocationChange: false }).then(() => {
      //this.route.navigate(['profile'], { queryParams: { searchString: trim(this.input.nativeElement.value) } });
    });
  }
}
