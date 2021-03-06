import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import * as io from 'socket.io-client';

// const base_url: string = `http://localhost:3000`
const base_url: string = `http://ec2-35-154-109-203.ap-south-1.compute.amazonaws.com:3000`

@Injectable()
export class AuthenticationService {
  private token: string
  private socket = io(`${base_url}`);   

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('usertoken', token)
    this.token = token
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('usertoken')
    }
    return this.token
  }

  public getUserDetails(): any {
    const token = this.getToken()
    let payload
    if (token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails()
    if (user) {
      return user.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  public register(user: any): Observable<any> {
    const base = this.http.post(`${base_url}/user/register`, user)

    const request = base.pipe(
      map((data: any) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        // console.log('data returned ', data);
        return data
      })
    )

    return request
  }

  public login(user: any): Observable<any> {
    const base = this.http.post(`${base_url}/user/login`, user)

    const request = base.pipe(
      map((data: any) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )

    return request
  }

  public profile(): Observable<any> {
    return this.http.get(`${base_url}/users/profile`, {
      headers: { Authorization: ` ${this.getToken()}` }
    })
  }

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('usertoken')
    this.router.navigateByUrl('/')
  }

  public joinRoom(data) {
    this.socket.emit('join', data);
  }

  public sendMessage(data) {
    this.socket.emit('message', data);
  }
  
  public newMessageReceived(){
    let observable = new Observable<any>(observer=>{
        this.socket.on('new message', (data)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
}

}