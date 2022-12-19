class Player {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  getID(): string {
    return this.id;
  }
}

export default Player;
