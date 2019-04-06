import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';
import { World } from '../Interfaces/World';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../Interfaces/User';

@Injectable()
export class WorldService {

  world: World = null;
  wordChangeListener: Subscriber<boolean>[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
    userService.getUser().then(user => {
      this.loadWorld();
    });
  }

  public onWorldChange(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.wordChangeListener.push(observer);
    });
  }

  public worldChanged(): void {
    this.wordChangeListener.forEach(l => l.next(true));
  }

  public getWorlds(): Observable<World[]> {
    return this.http.get<World[]>(`${environment.endpoint}/world/worlds`);
  }

  public getWorldsForUser(user: User): Promise<World[]> {
    return this.http.get<World[]>(`${environment.endpoint}/world/user/${user.id}`).toPromise();
  }

  public getAllWorlds(): Observable<World[]> {
    return this.http.get<World[]>(`${environment.endpoint}/world/all`);
  }

  public loadWorld(): void {
    this.http.get<World>(`${environment.endpoint}/world/current`)
      .subscribe(world => {
        this.world = world;
        this.worldChanged();
      });
  }

  public getCurrentWorld(): World {
    return this.world;
  }

  public setCurrentWorld(world: World): Promise<World> {
    return this.http.post<World>(`${environment.endpoint}/world/current`, world).toPromise();
  }

  updateWorld(world: World): Promise<World> {
    return this.http.post<World>(`${environment.endpoint}/world/world`, world).toPromise();
  }

  updateBackground(world: World, image: string): Promise<World> {
    return this.http.put<World>(`${environment.endpoint}/world/world/${world.id}/image`, image).toPromise();
  }

  public getActiveWorlds(): Promise<World[]> {
    return this.http.get<World[]>(`${environment.endpoint}/world/active`).toPromise();
  }

  public generateWorldsFromSonarQubeProjects(): Promise<World[]> {
    return this.http.get<World[]>(`${environment.endpoint}/world/generate`).toPromise();
  }

}
