import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

const base_url: string = `http://localhost:3000/`

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  public getAllUsers() {

    const base = this.http.get(`${base_url}user/getAllUsers`)

    const request = base.pipe(
      map((data: any) => {
        // console.log('data returned ', data);
        return data
      })
    )

    return request
  }

  public sendChatMessage(messageObject) {
    
    const base = this.http.post(`${base_url}user/sendMessage`, messageObject)

    const request = base.pipe(
      map((data: any) => {
        return data
      })
    )
    return request;
  }

  public getMessageByChatRoom(chatRoom) {
    
    const base = this.http.post(`${base_url}user/getMessageByChatRoom`, chatRoom)

    const request = base.pipe(
      map((data: any) => {
        return data
      })
    )
    return request;
  }
}
