export interface IIdStore {
  fetchIds: () => Array<string>;
  addId: (id: string) => void;
  getCurrentId: () => string;
  setCurrentId: (id: string) => void;
}

export class LocalIdStore implements IIdStore {
  private idsKey = "ids";
  private currentIdKey = "currentid";

  fetchIds(): Array<string> {
    const idsValue: string | null = localStorage.getItem(this.idsKey);
    const ids: Array<string> = JSON.parse(idsValue ?? "[]");
    return ids ?? [];
  }

  addId(id: string): void {
    const ids = this.fetchIds();
    ids.unshift(id);
    localStorage.setItem(this.idsKey, JSON.stringify(ids));
  }

  getCurrentId(): string {
    const idValue: string | null = localStorage.getItem(this.currentIdKey);
    return idValue ?? "";
  }

  setCurrentId(id: string): void {
    localStorage.setItem(this.currentIdKey, id);
  }
}
