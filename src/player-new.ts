class Player {
  name: string;
  id: string;
  ready: boolean;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.ready = false;
  }

  getName(): string {
    return this.name;
  }

  getID(): string {
    return this.id;
  }

  toggleReady() {
    this.ready = !this.ready;
  }

  getReady() {
    return this.ready;
  }

  getJSONFormat(){
    return {id: this.id, name: this.name, ready: this.ready};
  }
}

export default Player;
